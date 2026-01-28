const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

const assert = chai.assert
chai.use(chaiHttp)

let issueId

describe('Issue Tracker Functional Tests', function () {

  it('Create an issue with every field', done => {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Bug',
        issue_text: 'Fix it',
        created_by: 'Maya',
        assigned_to: 'Dev',
        status_text: 'In Progress'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.exists(res.body._id)
        issueId = res.body._id
        done()
      })
  })

  it('Create an issue with only required fields', done => {
    chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Bug 2',
        issue_text: 'Fix again',
        created_by: 'Maya'
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        done()
      })
  })

  it('Create an issue with missing required fields', done => {
    chai.request(server)
      .post('/api/issues/test')
      .send({ issue_title: 'Bug' })
      .end((err, res) => {
        assert.equal(res.body.error, 'required field(s) missing')
        done()
      })
  })

  it('View issues on a project', done => {
    chai.request(server)
      .get('/api/issues/test')
      .end((err, res) => {
        assert.isArray(res.body)
        done()
      })
  })

  it('View issues on a project with one filter', done => {
    chai.request(server)
      .get('/api/issues/test?open=true')
      .end((err, res) => {
        assert.isArray(res.body)
        done()
      })
  })

  it('View issues on a project with multiple filters', done => {
    chai.request(server)
      .get('/api/issues/test?open=true&created_by=Maya')
      .end((err, res) => {
        assert.isArray(res.body)
        done()
      })
  })

  it('Update one field on an issue', done => {
    chai.request(server)
      .put('/api/issues/test')
      .send({ _id: issueId, issue_text: 'Updated' })
      .end((err, res) => {
        assert.equal(res.body.result, 'successfully updated')
        done()
      })
  })

  it('Update multiple fields on an issue', done => {
    chai.request(server)
      .put('/api/issues/test')
      .send({
        _id: issueId,
        issue_text: 'Updated again',
        status_text: 'Done'
      })
      .end((err, res) => {
        assert.equal(res.body.result, 'successfully updated')
        done()
      })
  })

  it('Update an issue with missing _id', done => {
    chai.request(server)
      .put('/api/issues/test')
      .send({ issue_text: 'No id' })
      .end((err, res) => {
        assert.equal(res.body.error, 'missing _id')
        done()
      })
  })

  it('Update an issue with no fields to update', done => {
    chai.request(server)
      .put('/api/issues/test')
      .send({ _id: issueId })
      .end((err, res) => {
        assert.equal(res.body.error, 'no update field(s) sent')
        done()
      })
  })

  it('Update an issue with an invalid _id', done => {
    chai.request(server)
      .put('/api/issues/test')
      .send({ _id: 'invalid', issue_text: 'Fail' })
      .end((err, res) => {
        assert.equal(res.body.error, 'could not update')
        done()
      })
  })

  it('Delete an issue', done => {
    chai.request(server)
      .delete('/api/issues/test')
      .send({ _id: issueId })
      .end((err, res) => {
        assert.equal(res.body.result, 'successfully deleted')
        done()
      })
  })

  it('Delete an issue with an invalid _id', done => {
    chai.request(server)
      .delete('/api/issues/test')
      .send({ _id: 'invalid' })
      .end((err, res) => {
        assert.equal(res.body.error, 'could not delete')
        done()
      })
  })

  it('Delete an issue with missing _id', done => {
    chai.request(server)
      .delete('/api/issues/test')
      .send({})
      .end((err, res) => {
        assert.equal(res.body.error, 'missing _id')
        done()
      })
  })

})
