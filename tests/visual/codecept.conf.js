import { secret } from 'codeceptjs'

const port = process.env.VISUAL_PORT || 8040

export const config = {
  tests: './tests/*_test.js',
  output: './output',
  // Clean server with in-memory database and fixture.json for each run
  webServer: {
    command: 'npm run server',
    url: `http://localhost:${port}/admin/login/`,
    timeout: 120000,
  },
  helpers: {
    Playwright: {
      url: `http://localhost:${port}`,
      browser: 'chromium',
      show: false,
      windowSize: '1440x900',
      // Same timezone as the server, otherwise the date fields show a timezone warning
      emulate: { timezoneId: 'America/Chicago', locale: 'en-US', colorScheme: 'light' },
    },
    Visual: {
      require: './visual_helper.js',
      tolerance: 0.1,
      // Wait after the viewport change, the sidebar opens or closes in an async resize handler
      delay: 150,
      viewports: {
        mobile: [390, 844],
        tablet: [1024, 768],
        desktop: [1440, 900],
      },
      // Values that change on every run: dates, random password salt, async map tiles (children too, because some set their own visibility)
      hide: ['.field-display_datetime', '.field-last_login', '.field-date_joined', '#id_password', '#map_location', '#map_location *', '#recent-actions-module .text-xs'],
      // Password summary has a different width for each salt, so remove its content and keep the box
      style: '#id_password { flex: 1 1 0; min-width: 0; height: 2.5rem; } #id_password > * { display: none; }',
    },
  },
  include: {
    I: './steps_file.js',
  },
  plugins: {
    auth: {
      enabled: true,
      inject: 'login',
      users: {
        admin: {
          login: (I) => {
            I.amOnPage('/admin/login/')
            I.fillField('username', process.env.ADMIN_USER || 'admin')
            I.fillField('password', secret(process.env.ADMIN_PASSWORD || 'admin'))
            I.click('button[type=submit]')
            I.dontSeeInCurrentUrl('/login/')
          },
          check: (I) => {
            I.amOnPage('/admin/')
            I.dontSeeInCurrentUrl('/login/')
          },
        },
      },
    },
  },
  name: 'unfold-visual-tests',
}
