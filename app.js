const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const fs = require('fs')
const Path = ('./public/jsons/shorten.json')
const jsonData = fs.readFileSync(Path, 'utf8')
const existingData = JSON.parse(jsonData)

const app = express()
const port = 3000



//setup handlerbars
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views','./views')


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // for parsing application/json


app.get('/',(req, res) =>{
  res.render('index', {showInput: true})
})

app.post('/shorten', (req, res) =>{
  const originalUrl = req.body.originalUrl
  console.log("shorten2: ", req.body)
  const shortUrl = generateShortUrl(originalUrl)
  saveShortUrl(originalUrl, shortUrl)
  res.render('index',{port, originalUrl,shortUrl, showInput:false})
})

app.get('/:shortUrl',(req,res) =>{
  const shortUrl = req.params.shortUrl
  const originalUrl = getOriginalUrl(shortUrl)
  if(originalUrl){
       res.redirect(originalUrl)
  }
  else{
    res.status(404).send('URL not found')
  }
})



function generateShortUrl(originalUrl) {
   const existingUrl = existingData.results.find(item => item.originalUrl === originalUrl)
if(existingUrl){
  return existingUrl.shortUrl
}else{
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let shortUrl = ''
    for (let i = 0; i < 5; i++) {
      shortUrl += characters[Math.floor(Math.random() * characters.length)]
    }
    return shortUrl; 
}
}

function saveShortUrl(originalUrl, shortUrl) {
  // Save to JSON file logic here
     const existingUrl = existingData.results.find(item => item.originalUrl === originalUrl)
     if(!existingUrl){
  existingData.results.push({originalUrl, shortUrl})
  fs.writeFileSync(Path, JSON.stringify(existingData))}
}

function getOriginalUrl(shortUrl) {
  // Retrieve original URL from JSON file logic here
  const result = existingData.results.find(item => item.shortUrl === shortUrl)
  if (result) {
    let originalUrl = result.originalUrl
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      originalUrl = 'http://' + originalUrl
    }
    return originalUrl 
  } else { 
  return null
 }
}

app.listen(port, ()=>{
  console.log(`express service is running on http://localhost:${port}`)
})