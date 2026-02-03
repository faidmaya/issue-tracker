const express = require('express')
const router = express.Router()

let issues = []   // 🔴 IN-MEMORY STORAGE

function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

/* POST */
router.post('/:project', (req, res) => {
  const { issue_title, issue_text, created_by } = req.body

  if (!issue_title || !issue_text || !created_by) {
    return res.json({ error: 'required field(s) missing' })
  }

  const issue = {
    _id: generateId(),
    project: req.params.project,
    issue_title,
    issue_text,
    created_by,
    assigned_to: req.body.assigned_to || '',
    status_text: req.body.status_text || '',
    created_on: new Date(),
    updated_on: new Date(),
    open: true
  }

  issues.push(issue)
  res.json(issue)
})

/* GET */
router.get('/:project', (req, res) => {
  let filtered = issues.filter(i => i.project === req.params.project)

  Object.keys(req.query).forEach(key => {
    filtered = filtered.filter(issue =>
      String(issue[key]) === String(req.query[key])
    )
  })

  res.json(filtered)
})

/* PUT */
router.put('/:project', (req, res) => {
  const { _id, ...rest } = req.body

  // 1️⃣ missing _id
  if (!_id) {
    return res.json({ error: 'missing _id' })
  }

  // 2️⃣ check update fields (FCC rules)
  const updateFields = Object.keys(rest).filter(key =>
    rest[key] !== undefined && rest[key] !== ''
  )

  if (updateFields.length === 0) {
    return res.json({ error: 'no update field(s) sent', _id })
  }

  // 3️⃣ find issue
  const issue = issues.find(i => i._id === _id)
  if (!issue) {
    return res.json({ error: 'could not update', _id })
  }

  // 4️⃣ apply updates
  updateFields.forEach(field => {
    issue[field] = rest[field]
  })

  issue.updated_on = new Date()

  return res.json({ result: 'successfully updated', _id })
})

/* DELETE */
router.delete('/:project', (req, res) => {
  const { _id } = req.body

  if (!_id) {
    return res.json({ error: 'missing _id' })
  }

  const index = issues.findIndex(i => i._id === _id)
  if (index === -1) {
    return res.json({ error: 'could not delete', _id })
  }

  issues.splice(index, 1)
  res.json({ result: 'successfully deleted', _id })
})

module.exports = router
