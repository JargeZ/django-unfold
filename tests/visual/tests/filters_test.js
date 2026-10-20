Feature('Filters')

Before(({ login }) => {
  login('admin')
})

Scenario('all filters', ({ I }) => {
  I.amOnPage('/admin/example/filteruser/')
  I.openFilters()
  I.seeVisualMatch('filters-changelist')
})

Scenario('text filter', ({ I }) => {
  I.amOnPage('/admin/example/filteruser/')
  I.openFilters()
  I.fillField('text_username', 'ali')
  I.click('Apply Filters', '#changelist-filter')
  I.seeInCurrentUrl('text_username=ali')
  I.see('alice', '#result_list')
  I.dontSee('bob', '#result_list')
  I.seeVisualMatch('filters-text')
})

Scenario('choice filters', ({ I }) => {
  I.amOnPage('/admin/example/filteruser/')
  I.openFilters()
  I.checkOption('Pending', '#changelist-filter')
  I.click('Apply Filters', '#changelist-filter')
  I.seeInCurrentUrl('status__exact=pending')
  I.seeVisualMatch('filters-choice')
})

Scenario('change form with numeric fields', ({ I }) => {
  I.amOnPage('/admin/example/filteruser/2/change/')
  I.seeVisualMatch('filters-change-form')
})
