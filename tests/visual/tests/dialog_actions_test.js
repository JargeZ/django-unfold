Feature('Dialog actions')

const dialog = '#modal-content'

Before(({ login }) => {
  login('admin')
})

Scenario('dialog action', ({ I }) => {
  I.amOnPage('/admin/example/dialogactionuser/')
  I.clickHeaderAction('Dialog action')
  I.waitForText('This is a dialog action', 5, dialog)
  I.seeVisualMatch('dialog-action')
  I.click('Submit', dialog)
  I.seeMessage('Action successfully executed')
})

Scenario('dialog action with a form', ({ I }) => {
  I.amOnPage('/admin/example/dialogactionuser/')
  I.clickHeaderAction('Dialog action with form')
  I.waitForText("Type 'CONFIRM' to proceed", 5, dialog)
  I.seeVisualMatch('dialog-form')
  I.fillField('confirm', 'NO')
  I.click('Submit', dialog)
  I.waitForText('You must confirm to proceed.', 5, dialog)
  I.seeVisualMatch('dialog-form-error')
  I.fillField('confirm', 'CONFIRM')
  I.click('Submit', dialog)
  I.seeMessage('Action successfully executed')
})

Scenario('row dialog action', ({ I }) => {
  I.amOnPage('/admin/example/dialogactionuser/')
  I.openRowActions('alice')
  I.clickRowAction('Dialog action with form')
  I.waitForText('Row dialog action with custom form', 5, dialog)
  I.seeVisualMatch('dialog-row')
})

Scenario('change form dialog action', ({ I }) => {
  I.amOnPage('/admin/example/dialogactionuser/2/change/')
  I.clickHeaderAction('Dialog action')
  I.waitForText('This is a dialog action', 5, dialog)
  I.seeVisualMatch('dialog-change-form')
})
