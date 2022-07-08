import express from 'express'
const router = express.Router()

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes


router.get('/', async (req, res) => {
  res.send({ hello: 'wuuuurld' })
})

export default router
