const Page = require('./helpers/page')

let page

beforeEach(async () => {
  page = await page.build()
  await page.goto('http://localhost:3000')
})

afterEach(async () => {
  await page.close()
})

describe('when logged in', async () => {
  beforeEach(async () => {
    await page.login()
    await page.click('a.btn-floating')
  })

  test('Can see blog creation form', async () => {
    const text = await page.getContentsOf('form label')
    expect(text).toEqual('Blog Title')
  })

  describe('and using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title')
      await page.type('.content input', 'My Content')
      await page.click('form button')
    })

    test('submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5')
      expect(text).toEqual('Please Confirm your Enteries')
    })

    test('submitting then saving add blog to index page', async () => {
      await page.click('button.green')
      await page.waitFor('.card')

      const title = await page.getContentsOf('.card .title')
      const content = await page.getContentsOf('p')

      expect(title).toEqual('My Title')
      expect(content).toEqual('My Content')
    })
  })

  describe('and using invalid inputs', async () => {
    beforeEach(async () => {
      await page.click('form button')
    })
    test('the form shows an error message', async () => {
      const text = page.getContentsOf('.title .red-text')
      const content = page.getContentsOf('.content .red-text')

      expect(text).toEqual('You must provide a value')
      expect(content).toEqual('You must provide a value')
    })
  })
})
