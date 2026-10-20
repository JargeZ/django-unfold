Feature('Import and export')

Before(({ login }) => {
  login('admin')
})

Scenario('import users form', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.clickHeaderAction('Import')
  I.see('This importer will import the following fields', '#content')
  I.seeVisualMatch('import-users-form')
})

Scenario('import projects from a file', ({ I }) => {
  I.amOnPage('/admin/example/project/')
  I.clickHeaderAction('Import')
  I.attachFile('import_file', 'data/projects.csv')
  I.selectOption('format', 'csv')
  I.seeVisualMatch('import-projects-form')
  I.click('Submit', '#content')
  I.see('Confirm import', '#content')
  I.seeVisualMatch('import-projects-preview')
  I.click('Confirm import')
  I.seeMessage('Import finished')
  I.seeVisualMatch('import-projects-finished')
})

Scenario('export users', ({ I }) => {
  I.amOnPage('/admin/example/user/')
  I.clickHeaderAction('Export')
  I.selectOption('format', 'csv')
  I.seeVisualMatch('export-form')
})

Scenario('export projects with selectable fields', ({ I }) => {
  I.amOnPage('/admin/example/project/export/')
  I.see('This exporter will export the following fields')
  I.seeVisualMatch('export-selectable-fields')
})
