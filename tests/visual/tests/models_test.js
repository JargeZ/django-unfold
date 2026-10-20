Feature('Models')

Before(({ login }) => {
  login('admin')
})

Scenario('create a tag and find it', ({ I }) => {
  I.openFromSidebar('Tags')
  I.seeVisualMatch('models-tags')
  I.clickAdd()
  I.fillField('name', 'Visual testing')
  I.click('Save')
  I.seeMessage('was added successfully')
  I.searchFor('Visual')
  I.see('Visual testing', '#result_list')
  I.seeVisualMatch('models-tag-search')
})

Scenario('labels', ({ I }) => {
  I.openFromSidebar('Labels')
  I.seeVisualMatch('models-labels')
})

Scenario('category with a nonrelated inline', ({ I }) => {
  I.openFromSidebar('Categories')
  I.seeVisualMatch('models-categories')
  I.click('Engineering', '#result_list')
  I.see('Projects', '#content')
  I.seeVisualMatch('models-category-change')
})

Scenario('projects with infinite pagination', ({ I }) => {
  I.openFromSidebar('Projects')
  I.seeVisualMatch('models-projects')
  I.click('Next')
  I.seeInCurrentUrl('p=2')
  I.seeVisualMatch('models-projects-page-2')
})

Scenario('create a task', ({ I }) => {
  I.openFromSidebar('Tasks')
  I.seeVisualMatch('models-tasks')
  I.clickAdd()
  I.fillField('name', 'Write visual tests')
  I.selectOption('project', 'Project 01')
  I.seeVisualMatch('models-task-add')
  I.click('Save')
  I.seeMessage('was added successfully')
  I.seeVisualMatch('models-task-added')
})

Scenario('profiles', ({ I }) => {
  I.openFromSidebar('Profiles')
  I.seeVisualMatch('models-profiles')
  I.click('Default profile', '#result_list')
  I.seeVisualMatch('models-profile-change')
})

Scenario('posts with ordering', ({ I }) => {
  I.openFromSidebar('Posts')
  I.seeVisualMatch('models-posts')
})

Scenario('create a group with permissions', ({ I }) => {
  I.openFromSidebar('Groups')
  I.seeVisualMatch('models-groups')
  I.clickAdd()
  I.fillField('name', 'Reviewers')
  I.fillField('#id_permissions_input', 'Can view project')
  I.click('Choose all permissions')
  I.seeVisualMatch('models-group-add')
  I.click('Save')
  I.seeMessage('was added successfully')
})
