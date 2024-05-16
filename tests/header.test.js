const Page = require('./helpers/page')
let page

beforeEach(async () => {
  page = await Page.build()
  page = await page.goto('http://localhost:3000')
})

afterEach(async () => {
  await page.close()
})

test('the header has the correct text', async () => {
  const text = await page.getContentsOf('a.brand-logo')
  expect(text).toEqual('Blogster')
})

test('when signed in, show logout button', async () => {
  await page.login()

  const text = await page.getContentsOf('a[href="auth/logout"]')

  expect(text).toEqual('Logout')
})
