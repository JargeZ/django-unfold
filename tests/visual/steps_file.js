const sidebar = '#nav-sidebar'
const header = '#header-inner'
const openDropdown = 'body > nav:not([style*="display: none"])'

// Link with exactly this text (icons ignored), so "Users" does not match "Action users"
const link = (text) => ({ xpath: `.//a[normalize-space(text()[normalize-space()][last()])="${text}"]` })

export default function () {
  return actor({
    openFromSidebar(model) {
      this.amOnPage('/admin/')
      this.click(link(model), sidebar)
    },

    clickAdd() {
      this.click('a.addlink', header)
    },

    clickHeaderAction(title) {
      this.click(link(title), header)
    },

    openHeaderDropdown(title) {
      this.click(title, header)
    },

    searchFor(term) {
      this.fillField('q', term)
      this.pressKey('Enter')
      this.seeInCurrentUrl(`q=${encodeURIComponent(term)}`)
    },

    selectRow(text) {
      this.checkOption('Select record', locate('tr').withText(text))
    },

    openRowActions(text) {
      this.click('more_horiz', locate('tr').withText(text))
      this.waitForVisible(openDropdown)
    },

    clickRowAction(title) {
      this.click(title, openDropdown)
    },

    openFilters() {
      this.click('.filter-open-button')
      this.waitForVisible('#changelist-filter')
    },

    openUserMenu() {
      this.click('Ada Admin', sidebar)
      this.waitForVisible('#logout-form')
    },

    switchTheme(name) {
      this.openUserMenu()
      this.click(name, sidebar)
    },

    seeMessage(text) {
      this.waitForText(text, 5, '#main')
    },
  })
}
