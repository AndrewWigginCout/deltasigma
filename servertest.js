const express = require('express')
const app = express()
app.use(express.static('perfect-learn'))

const unknownEndpoint = (request, response) => {
    response.status(404).send(request)
  }
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})