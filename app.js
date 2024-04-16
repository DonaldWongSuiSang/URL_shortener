const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const fs = require('fs')

// Path to the JSON file
const Path = ('./public/jsons/shorten.json')
const jsonData = fs.readFileSync(Path, 'utf8')
const existingData = JSON.parse(jsonData)

const app = express()
const port = 3000

//setup handlerbars
app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views','./views')

// static file & Body parser middleware for parsing form data
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json()) // for parsing application/json

// Route to render the index page
app.get('/',(req, res) =>{
  res.render('index', {showInput: true})  // Pass 'showInput' variable to indicate whether to show the input form or not
})

// Route to handle form submission and URL shortening
app.post('/shorten', (req, res) =>{
  const originalUrl = req.body.originalUrl
  const shortUrl = generateShortUrl(originalUrl)
  saveShortUrl(originalUrl, shortUrl)
  res.render('index',{port, originalUrl,shortUrl, showInput:false}) // Pass data to render the index page with the shortened URL
})

// Route to handle redirecting short URLs to original URLs
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


// Function to generate a short URL
function generateShortUrl(originalUrl) {
 
   const existingUrl = existingData.results.find(item => item.originalUrl === originalUrl)
  if(existingUrl){
    return existingUrl.shortUrl
    //return the same group of shortUrl if the original is inputted before
  }else{
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let shortUrl = ''
    for (let i = 0; i < 5; i++) {
      shortUrl += characters[Math.floor(Math.random() * characters.length)]
    }
    return shortUrl
  }
}

// Function to save a new short URL to the JSON file
function saveShortUrl(originalUrl, shortUrl) {
  const existingUrl = existingData.results.find(item => item.originalUrl === originalUrl)
  if(!existingUrl){
    existingData.results.push({originalUrl, shortUrl})
    fs.writeFileSync(Path, JSON.stringify(existingData))
  }
}

// Function to retrieve the original URL for a given short URL
function getOriginalUrl(shortUrl) {
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

// Start the server
app.listen(port, ()=>{
  console.log(`express service is running on http://localhost:${port}`)
})