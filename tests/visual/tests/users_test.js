Feature('Users')

Before(({ login }) => {
  login('admin')
})

Scenario('changelist', ({ I }) => {
  I.openFromSidebar('Users')
  I.see('alice', '#result_list')
  I.seeVisualMatch('users-changelist')
})

Scenario('search', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.searchFor('alice')
  I.see('alice', '#result_list')
  I.dontSee('bob', '#result_list')
  I.seeVisualMatch('users-search')
})

Scenario('search without results', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.searchFor('nobody')
  I.see('No results found', '#content')
  I.seeVisualMatch('users-search-empty')
})

Scenario('sort by column', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.click('Email address', '#result_list thead')
  I.seeInCurrentUrl('o=')
  I.seeVisualMatch('users-sorted')
})

Scenario('select rows for an action', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.selectRow('alice')
  I.selectRow('bob')
  I.seeElement('#changelist-actions')
  I.seeVisualMatch('users-rows-selected')
})

Scenario('dropdown in a list column', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.click('Custom dropdown title', locate('tr').withText('alice'))
  I.waitForText('template content')
  I.seeVisualMatch('users-column-dropdown', { viewports: ['desktop'] })
})

Scenario('change form tabs', ({ I }) => {
  I.amOnPage('/admin/example/user/2/change/')
  I.see('Alice', 'h1')
  I.seeVisualMatch('users-change-general')
  I.click('Personal info')
  I.seeVisualMatch('users-change-personal-info')
  I.click('Permissions')
  I.seeVisualMatch('users-change-permissions')
})

Scenario('change form inline and dataset tabs', ({ I }) => {
  I.amOnPage('/admin/example/user/2/change/')
  I.click('User-tag relationships', '#tabs-items')
  I.seeVisualMatch('users-change-tags-inline')
  I.click('Projects', '#tabs-items')
  I.seeVisualMatch('users-change-projects-dataset')
})

Scenario('create a user', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.clickAdd()
  I.seeInCurrentUrl('/admin/example/user/add/')
  I.seeVisualMatch('users-add')
  I.fillField('username', 'dave')
  I.fillField('password1', 'visual-tests-password')
  I.fillField('password2', 'visual-tests-password')
  I.click('Save and continue editing')
  I.seeMessage('was added successfully')
  I.seeVisualMatch('users-added')
})

Scenario('validation errors', ({ I }) => {
  I.amOnPage('/admin/example/user/add/')
  I.fillField('username', 'alice')
  I.fillField('password1', 'short')
  I.fillField('password2', 'other')
  I.click('Save')
  I.see('Please correct the errors below.')
  I.seeVisualMatch('users-add-errors')
})

Scenario('change password', ({ I }) => {
  I.amOnPage('/admin/example/user/3/change/')
  I.click('Reset password')
  I.seeInCurrentUrl('/password/')
  I.seeVisualMatch('users-password')
  I.fillField('password1', 'visual-tests-password')
  I.fillField('password2', 'visual-tests-password')
  I.click('Change password', '#content-main')
  I.seeMessage('Password changed successfully')
})

Scenario('history', ({ I }) => {
  I.amOnPage('/admin/example/user/4/change/')
  I.fillField('First name', 'Caroline')
  I.click('Save and continue editing')
  I.seeMessage('was changed successfully')
  I.clickHeaderAction('History')
  I.seeInCurrentUrl('/history/')
  // Date width changes with the current time, so columns get equal widths
  I.seeVisualMatch('users-history', { hide: ['#content tbody td:first-child'], style: '#content table { table-layout: fixed; }' })
})

Scenario('delete confirmation', ({ I }) => {
  I.amOnPage('/admin/example/user/3/change/')
  I.click('Delete user')
  I.see('Are you sure you want to delete', '#content')
  I.seeVisualMatch('users-delete')
})

Scenario('crispy form', ({ I }) => {
  I.amOnPage('/admin/example/user/crispy-form')
  I.seeVisualMatch('users-crispy-form')
})
