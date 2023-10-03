const app = require('../../index')
const request = require('supertest')

describe('Test Server', () => {
  test('Requires Http Auth Header', async () => {
    await request(app.server.server).get('/')
      .expect(401)
      .expect({
        error: 'unauthorized access to resource'
      })
  })

  test('Show Empty Data in Root', async () => {
    await request(app.server.server).get('/documents')
      .set({ Authorization: 'Bearer any' })
      .expect(200)
      .expect([])
  })

  test('Test Create Resource', async () => {
    await request(app.server.server).post('/documents')
      .set({ Authorization: 'Bearer any' })
      .send({
        id: 'isb',
        name: 'test'
      })
      .expect(200)
  })

  test('Test Get Resource', async () => {
    await request(app.server.server).get('/documents/isb')
      .set({ Authorization: 'Bearer any' })
      .expect(200)
      .expect({
        id: 'isb',
        name: 'test'
      })
  })

  test('Test Has Resources', async () => {
    await request(app.server.server).get('/documents')
      .set({ Authorization: 'Bearer any' })
      .expect(200)
      .expect([{
        id: 'isb',
        name: 'test'
      }])
  })

  test('Test Delete Resource', async () => {
    await request(app.server.server).delete('/documents/isb')
      .set({ Authorization: 'Bearer any' })
      .expect(204)
  })

  test('Test No More Resources', async () => {
    await request(app.server.server).get('/documents')
      .set({ Authorization: 'Bearer any' })
      .expect(200)
      .expect([])
  })
})
