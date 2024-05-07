import { expect } from 'chai'
import { agent as request } from 'supertest'
import { app } from './index.ts'

const expectedTree = [{name:'A', parentName:null, description:'This is a description of A', children:[ {name:'B', parentName:'A', description:'This is a description of B', children:[ {name:'B-1', parentName:'B', description:'This is a description of B-1', children:[]}, {name:'B-2', parentName:'B', description:'This is a description of B-2', children:[]}, {name:'B-3', parentName:'B', description:'This is a description of B-3', children:[]} ]}, {name:'C', parentName:'A', description:'This is a description of C', children:[]}, {name:'D', parentName:'A', description:'This is a description of D', children:[]} ]}]

describe('Express App', () => {
  it('GET / should return index.html', async() => {
    const response = await request(app).get('/')
    expect(response.status).to.equal(200)
    expect(response.text).to.contain('<!DOCTYPE html>')
  })

  it('GET /tree response should match the expected tree shape', async() => {
    const response = await request(app).get('/tree')
    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal(expectedTree)
  })

  it('GET /health should respond with a health check', async() => {
    const response = await request(app).get('/health')
    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal({ status: 'ok' })
  })
})
