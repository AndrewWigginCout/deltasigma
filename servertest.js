const express = require('express')
const fs      = require('fs')
const path    = require('path')
const app = express()
const morgan = require('morgan')
app.use(morgan('tiny'))
require('dotenv').config()
const Contact = require('./models/contact')

function fixnames (x){
  return{
    name: x['your name'],
    number: x['Phone number'],
    email: x['Email']
  }
}

function appendtoleadlog (content){
  try {
    fs.writeFileSync('perfect-learn/leadlog.txt', content+',\n', {flag: 'a+'})
    console.log('appendlead() written. content=',content)
  } catch (err) {
    console.error(err)
  }
}
app.get('/contact.html', (req,res)=>{
  var bool = Object.keys(req.query).length === 0
  if (bool){
    res.sendFile(path.join(__dirname,'perfect-learn','contact.html'))
  }
  else{
    console.log('query=',req.query)
    const dbobj = new Contact(fixnames(req.query))
    dbobj.save().then(x => {
      console.log(x)
      res.status(200).send(`<h3>Thank you for your interest<br>
        You entered:<br><pre>${JSON.stringify(x,null,2)}</pre>
        We will contact you shortly.</h3>`)
        appendtoleadlog(JSON.stringify(fixnames(req.query),null,2))
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