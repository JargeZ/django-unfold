Feature('Integrations')

Before(({ login }) => {
  login('admin')
})

Scenario('waffle flags', ({ I }) => {
  I.openFromSidebar('Flags')
  I.seeVisualMatch('waffle-flags')
  I.click('new_dashboard', '#result_list')
  I.seeVisualMatch('waffle-flag-change')
})

Scenario('waffle switches', ({ I }) => {
  I.openFromSidebar('Switches')
  I.seeVisualMatch('waffle-switches')
  I.clickAdd()
  I.fillField('name', 'visual_tests')
  I.click('Save')
  I.seeMessage('was added successfully')
})

Scenario('waffle samples', ({ I }) => {
  I.openFromSidebar('Samples')
  I.seeVisualMatch('waffle-samples')
  I.click('ab_test', '#result_list')
  I.seeVisualMatch('waffle-sample-change')
})

Scenario('constance config', ({ I }) => {
  I.openFromSidebar('Config')
  I.see('General Settings', '#content')
  I.seeVisualMatch('constance-config')
  I.fillField('SITE_NAME', 'Visual tests')
  I.click('Save')
  // Required file fields without a value make the save fail in the example project
  I.seeMessage('live settings')
  I.seeVisualMatch('constance-config-submitted')
})
