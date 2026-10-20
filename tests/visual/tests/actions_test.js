Feature('Actions')

Before(({ login }) => {
  login('admin')
})

Scenario('changelist actions', ({ I }) => {
  I.amOnPage('/admin/example/actionuser/')
  I.seeVisualMatch('actions-changelist')
  I.openHeaderDropdown('Changelist dropdown for actions')
  I.waitForVisible(locate('a').withText('Changelist action dropdown'))
  I.seeVisualMatch('actions-changelist-dropdown', { viewports: ['desktop'] })
  I.click('Changelist action dropdown')
  I.seeMessage('Changelist action dropdown successfully executed')
  I.seeVisualMatch('actions-changelist-executed')
})

Scenario('row actions', ({ I }) => {
  I.amOnPage('/admin/example/actionuser/')
  I.openRowActions('alice')
  I.seeVisualMatch('actions-row-dropdown', { viewports: ['desktop'] })
  I.clickRowAction('Changelist row action with mixed permissions true')
  I.seeMessage('Changelist row action with mixed permissions true successfully executed')
})

Scenario('change form actions', ({ I }) => {
  I.amOnPage('/admin/example/actionuser/2/change/')
  I.seeVisualMatch('actions-change-form')
  I.openHeaderDropdown('Changeform dropdown for actions')
  I.waitForVisible(locate('a').withText('Changeform action dropdown'))
  I.seeVisualMatch('actions-change-form-dropdown', { viewports: ['desktop'] })
  I.click('Changeform action')
  I.seeMessage('Changeform action successfully executed')
})

Scenario('submit line action', ({ I }) => {
  I.amOnPage('/admin/example/actionuser/2/change/')
  I.click('Submit line action')
  I.seeMessage('Submit line action successfully executed')
  I.seeVisualMatch('actions-submit-line-executed')
})
