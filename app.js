const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views','./views')
app.use(express.static('public'))

app.get('/',(req, res) =>{
  res.render('index')
})

app.get('/:shorten_id', (req, res) =>{
const shorten_id = req.params.shorten_id
  res.send(`shortener id: ${shorten_id}`)
})
app.listen(port, ()=>{
  console.log(`express service is running on http://localhost:${port}`)
})
