const express = require('express')
const app = express()
const port = 3000

app.get('/',(req, res) =>{
  res.send('express app for URL_shortener')
})

app.get('/:shorten_id', (req, res) =>{
const shorten_id = req.params.shorten_id
  res.send(`shortener id: ${shorten_id}`)
})
app.listen(port, ()=>{
  console.log(`express service is running on http://localhost:${port}`)
})