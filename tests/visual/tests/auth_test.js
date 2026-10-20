Feature('Authentication')

Scenario('login page', ({ I }) => {
  I.amOnPage('/admin/login/')
  I.seeVisualMatch('auth-login')
})

Scenario('login with a wrong password', ({ I }) => {
  I.amOnPage('/admin/login/')
  I.fillField('username', 'admin')
  I.fillField('password', 'wrong-password')
  I.click('button[type=submit]')
  I.see('Please enter the correct username and password')
  I.seeVisualMatch('auth-login-error')
})

Scenario('log out', ({ I, login }) => {
  login('admin')
  I.amOnPage('/admin/')
  I.openUserMenu()
  I.seeVisualMatch('auth-user-menu')
  I.click('Log out')
  I.see('successfully logged out')
  I.seeVisualMatch('auth-logged-out')
})
