Feature('Navigation')

Before(({ login }) => {
  login('admin')
})

Scenario('dashboard', ({ I }) => {
  I.amOnPage('/admin/')
  I.see('Site administration', 'h1')
  I.seeVisualMatch('navigation-dashboard')
})

Scenario('app index', ({ I }) => {
  I.amOnPage('/admin/')
  I.click('Example', '#content')
  I.seeInCurrentUrl('/admin/example/')
  I.seeVisualMatch('navigation-app-index')
})

Scenario('sidebar navigation and breadcrumbs', ({ I }) => {
  I.openFromSidebar('Tags')
  I.seeInCurrentUrl('/admin/example/tag/')
  I.click('Python', '#result_list')
  I.see('Python', 'h1')
  I.seeVisualMatch('navigation-breadcrumbs')
  I.click('Tags', 'h1')
  I.seeInCurrentUrl('/admin/example/tag/')
})

Scenario('collapsed sidebar', ({ I }) => {
  I.amOnPage('/admin/')
  I.click('dock_to_right')
  I.seeVisualMatch('navigation-sidebar-collapsed', { viewports: ['desktop'] })
})

Scenario('dark theme', ({ I }) => {
  I.amOnPage('/admin/')
  I.switchTheme('Dark')
  I.seeElement('html.dark')
  I.seeVisualMatch('navigation-dashboard-dark')
  I.amOnPage('/admin/example/user/2/change/')
  I.seeVisualMatch('navigation-change-form-dark')
})

Scenario('custom site view', ({ I }) => {
  I.amOnPage('/admin/extra-url')
  I.see('Site Extra URL')
  I.seeVisualMatch('navigation-site-view')
})

Scenario('custom model view', ({ I }) => {
  I.amOnPage('/admin/example/project/extra-url')
  I.see('Model Extra URL')
  I.seeVisualMatch('navigation-model-view')
})

Scenario('page tabs', ({ I }) => {
  I.openFromSidebar('Users')
  I.click('Crispy form', '#tabs-items')
  // All user admins register the same URL name, so the tab opens the last registered one
  I.seeInCurrentUrl('/crispy-form')
  I.seeVisualMatch('navigation-tabs-crispy-form')
})

Scenario('page not found', ({ I }) => {
  I.amOnPage('/admin/example/tag/999/change/')
  I.seeVisualMatch('navigation-object-not-found')
})
