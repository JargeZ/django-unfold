Feature('List sections')

Before(({ login }) => {
  login('admin')
})

Scenario('expand a row section', ({ I }) => {
  I.amOnPage('/admin/example/sectionuser/')
  I.seeVisualMatch('sections-changelist')
  I.click('expand_more', locate('tr').withText('alice'))
  I.seeVisualMatch('sections-expanded')
})
