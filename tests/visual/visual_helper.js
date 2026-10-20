import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert'
import Helper from '@codeceptjs/helper'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const BASE_DIR = 'screenshots'
const REPORT_DIR = 'output/visual'

// Pads image with transparent pixels, so images with different heights can be compared
function resize(png, width, height) {
  if (png.width === width && png.height === height) return png
  const out = new PNG({ width, height })
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0)
  return out
}

function write(file, buffer) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buffer)
}

class Visual extends Helper {
  results = []

  // Takes a full page screenshot for each configured viewport and compares it with the base image.
  // `hide` makes extra elements with values that change on every run invisible, the layout stays the same.
  // `style` adds extra CSS, for example to keep column widths that depend on hidden values.
  // Missing base image or UPDATE_BASELINE=1 saves the screenshot as the new base image.
  async seeVisualMatch(name, { viewports = Object.keys(this.config.viewports), hide = [], style: extraStyle = '' } = {}) {
    const { page } = this.helpers.Playwright
    const initial = page.viewportSize()
    const failures = []
    const style = `${[...this.config.hide, ...hide].join(', ')} { visibility: hidden !important; } ${this.config.style} ${extraStyle}`

    // Wait for widgets that load data after the page load. Autofocus is applied at different moments, so remove the focus ring.
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.activeElement?.blur())

    for (const viewport of viewports) {
      const [width, height] = this.config.viewports[viewport]
      await page.setViewportSize({ width, height })
      await page.waitForTimeout(this.config.delay)
      // Clicks scroll wide pages horizontally, fixed elements like the sidebar then move in the full page screenshot
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.evaluate(() => document.fonts.ready.then(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))))

      const buffer = await page.screenshot({
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        style,
      })
      const result = { ...this._compare(`${name}-${viewport}`, buffer), case: name, viewport }
      this.results.push(result)
      if (result.status === 'changed') failures.push(`${result.name}: ${result.diff.toFixed(2)}%`)
    }

    await page.setViewportSize(initial)
    assert.ok(!failures.length, `Screenshots differ from base images: ${failures.join(', ')}`)
  }

  _compare(name, buffer) {
    const basePath = path.join(BASE_DIR, `${name}.png`)

    if (process.env.UPDATE_BASELINE || !fs.existsSync(basePath)) {
      write(basePath, buffer)
      return { name, status: 'new', diff: 0 }
    }

    let base = PNG.sync.read(fs.readFileSync(basePath))
    let actual = PNG.sync.read(buffer)
    const width = Math.max(base.width, actual.width)
    const height = Math.max(base.height, actual.height)
    base = resize(base, width, height)
    actual = resize(actual, width, height)

    const diffPng = new PNG({ width, height })
    const pixels = pixelmatch(base.data, actual.data, diffPng.data, width, height, { threshold: 0.1 })
    const diff = (100 * pixels) / (width * height)
    const status = diff > this.config.tolerance ? 'changed' : 'same'

    write(path.join(REPORT_DIR, 'actual', `${name}.png`), PNG.sync.write(actual))
    write(path.join(REPORT_DIR, 'diff', `${name}.png`), PNG.sync.write(diffPng))
    return { name, status, diff }
  }

  _finishTest() {
    if (!this.results.length) return
    const statuses = ['changed', 'new', 'same']
    const count = (status) => this.results.filter((r) => r.status === status).length
    // Open the report on the most important group, all results stay one click away
    const initial = statuses.find((status) => status !== 'same' && count(status)) || 'all'

    const cases = Object.groupBy(this.results, (r) => r.case)
    const sections = Object.entries(cases)
      .map(([name, results]) => {
        const status = statuses.find((s) => results.some((r) => r.status === s))
        const worst = Math.max(...results.map((r) => r.diff))
        return { name, results, status, worst }
      })
      .sort((a, b) => statuses.indexOf(a.status) - statuses.indexOf(b.status) || b.worst - a.worst || a.name.localeCompare(b.name))
      .map(({ name, results, status }) => {
        const figures = results.map(({ name: file, viewport, status, diff }) => {
          const base = `../../${BASE_DIR}/${file}.png`
          const actual = `actual/${file}.png`
          const img = (src, label) => `<a href="${src}" target="_blank"><span>${label}</span><img src="${src}" loading="lazy"></a>`
          const body = status === 'new'
            ? `<div class="side">${img(base, 'New')}</div>`
            : `<div class="side">${img(base, 'Base')}${img(actual, 'Actual')}${img(`diff/${file}.png`, 'Diff')}</div>
<div class="swipe" style="--x: 50%"><img src="${base}" loading="lazy"><img class="top" src="${actual}" loading="lazy"><input type="range" value="50" oninput="this.parentNode.style.setProperty('--x', this.value + '%')"></div>`
          return `<figure class="vp ${status}"><figcaption>${viewport} <b>${status}</b> ${diff.toFixed(2)}%</figcaption>${body}</figure>`
        })
        const badges = results.map((r) => `<i class="${r.status}">${r.viewport}</i>`).join('')
        return `<details class="case ${results.map((r) => r.status).join(' ')}" ${status === 'same' ? '' : 'open'}><summary>${name} ${badges}</summary>${figures.join('')}</details>`
      })
      .join('\n')

    const radio = (group, value, label, checked) => `<label><input type="radio" name="${group}" id="${group}-${value}" ${checked ? 'checked' : ''}> ${label}</label>`
    const filters = [...statuses.map((s) => radio('show', s, `${s} (${count(s)})`, s === initial)), radio('show', 'all', `all (${this.results.length})`, initial === 'all')].join('')
    const views = radio('view', 'side', 'Side by side', true) + radio('view', 'swipe', 'Swipe', false)
    const hide = statuses.map((s) => `body:has(#show-${s}:checked) :is(.case:not(.${s}), .vp:not(.${s})) { display: none; }`).join('\n  ')

    write(path.join(REPORT_DIR, 'report.html'), `<!doctype html>
<meta charset="utf-8">
<title>Visual report</title>
<style>
  :root { color-scheme: light dark; --line: #8884; --changed: #d33; --new: #27c; --same: #2a6; }
  body { font: 14px system-ui; margin: 0; }
  header { position: sticky; top: 0; z-index: 1; display: flex; flex-wrap: wrap; gap: 8px 24px; padding: 12px 16px; background: Canvas; border-bottom: 1px solid var(--line); }
  header div { display: flex; gap: 12px; }
  main { padding: 0 16px 16px; }
  summary { cursor: pointer; padding: 10px 0; font-weight: 600; border-bottom: 1px solid var(--line); }
  i { font: 12px system-ui; margin-left: 8px; padding: 1px 6px; border-radius: 4px; color: #fff; background: var(--same); }
  i.changed { background: var(--changed); }
  i.new { background: var(--new); }
  figure { margin: 12px 0 24px; }
  figcaption b { font-weight: 600; color: var(--same); }
  .changed figcaption b { color: var(--changed); }
  .new figcaption b { color: var(--new); }
  .side { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; align-items: start; }
  .side a { color: inherit; text-decoration: none; }
  .side span { display: block; font-size: 12px; opacity: .7; margin: 4px 0; }
  img { display: block; max-width: 100%; border: 1px solid var(--line); }
  .swipe { position: relative; display: none; width: fit-content; max-width: 100%; }
  .swipe .top { position: absolute; inset: 0; clip-path: inset(0 calc(100% - var(--x)) 0 0); }
  .swipe input { position: sticky; bottom: 8px; width: 100%; }
  body:has(#view-swipe:checked) .swipe { display: block; }
  body:has(#view-swipe:checked) .vp:not(.new) .side { display: none; }
  ${hide}
</style>
<header>
  <div>${filters}</div>
  <div>${views}</div>
</header>
<main>
${sections}
</main>
`)
    this.debug(`Visual report: ${path.resolve(REPORT_DIR, 'report.html')}`)
  }
}

export default Visual
