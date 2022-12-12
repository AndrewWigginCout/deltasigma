const express = require('express')
const fs      = require('fs')
const path    = require('path')
const app = express()
const morgan = require('morgan')
app.use(morgan('tiny'))
require('dotenv').config()
const nodemailer = require('nodemailer')
const user = process.env['user']
const pass = process.env['pass']

function fixnames (x){
  return{
    date: new Date(),
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
function emaillead(content) {
  let transporter = nodemailer.createTransport({
    host: "mobile.charter.net",
    port: 587,
    secure: true,
    auth: {
      user: user,
      pass: pass
    },
  });
  let info = transporter.sendMail({
    from: user,
    to: user,
    subject: "SALES LEAD",
    text: content
  });
  console.log("Message sent: %s", info.messageId);
}
app.get('/contact.html', (req,res)=>{
  var bool = Object.keys(req.query).length === 0
  if (bool){
    res.sendFile(path.join(__dirname,'perfect-learn','contact.html'))
  }
  else{
    console.log('query=',req.query)
    contact_record = fixnames(req.query)
    res.status(200).send(`<h3>Thank you for your interest<br>
      You entered:<br><pre>${JSON.stringify(contact_record,null,2)}</pre>
      We will contact you shortly.</h3>`)
      appendtoleadlog(JSON.stringify(contact_record,null,2))
      emaillead(JSON.stringify(contact_record,null,2))
    }})
app.use(express.static('perfect-learn'))

const unknownEndpoint = (request, response) => {
  response.status(404).send(`<h1>404</h1>`)
  }
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})