const express = require('express')
const app = express()
const fs   = require('fs')
require('dotenv').config()
const Contact = require('./models/contact')

var contact_html = fs.readFileSync("perfect-learn/contact.html")
var index_html = fs.readFileSync("perfect-learn/index.html")

function fixnames (x){
  return{
    name: x['your name'],
    number: x['Phone number'],
    email: x['Email']
  }
}

app.get('/index.html', (req,res)=>{
  var bool = Object.keys(req.query).length === 0
  if (bool){
    res.setHeader("Content-Type", "text/html")
    res.writeHead(200)
    res.end(index_html)
  }
  else{
    console.log('query=',req.query)
    const dbobj = new Contact(fixnames(req.query))
    dbobj.save().then(x => {
      res.status(200).send(`<h3>Thank you for your interest<br>
        You entered:<br>
        ${JSON.stringify(x)}<br>
        We will contact you shortly.`)
    })
  }
})
app.get('/contact.html', (req,res)=>{
  var bool = Object.keys(req.query).length === 0
  if (bool){
    res.setHeader("Content-Type", "text/html")
    res.writeHead(200)
    res.end(contact_html)
  }
  else{
    console.log('query=',req.query)
    const dbobj = new Contact(fixnames(req.query))
    dbobj.save().then(x => {
      console.log(x)
      res.status(200).send(`<h3>Thank you for your interest<br>
        You entered:<br>
        ${JSON.stringify(x)}<br>
        We will contact you shortly.`)
    })
  }
})
app.use(express.static('perfect-learn'))

const unknownEndpoint = (request, response) => {
  response.status(404).send(`<h1>404</h1>`)
  }
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})