const express = require('express');
const cors = require('cors');
const app = express();
const allPosts = require('./allPosts')
const myPosts = require('./myPosts')


app.use(express.json());
app.use(cors()) ;


function findTopPosts() {
  let sortedPosts = allPosts.sort((a, b) => (a.interactions < b.interactions) ? 1 : -1)
  return sortedPosts.slice(0, 2)
}


app.get('/', (req, res) => { 
    res.send('Welcome to our Open Up API!'); 
  })



app.get('/homepage', (req, res) => {
  res.send(findTopPosts(allPosts))
})

app.get('/allposts', (req, res) => {
  res.send(allPosts)
})

app.get('/myjournal', (req, res) => {
  res.send(myPosts)
})


  module.exports = app

