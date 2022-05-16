const express = require('express');
const cors = require('cors');
const app = express();
// const allPosts = require('./allPosts')
// const myPosts = require('./myPosts')
const fs = require('fs')


function getAllPosts() {
    try {
    const jsonString = fs.readFileSync('./allPost.json', 'utf-8')
    const allPosts = JSON.parse(jsonString)
    return allPosts
  } catch (err) {
    console.log(err)
  }
}

function findTopPosts() {
  try {
    const jsonString = fs.readFileSync('./allPost.json', 'utf-8')
    const allPosts = JSON.parse(jsonString)
    let sortedPosts = allPosts.sort((a, b) => (a.interactions < b.interactions) ? 1 : -1)
    return sortedPosts.slice(0, 2)
  } catch (err) {
    console.log(err)
  }
}




// jsonReader('./allPosts.json', (err, data) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(data)
//   }
// })

//update json



app.use(express.json());
app.use(cors()) ;


app.get('/', (req, res) => { 
    res.send('Welcome to our Open Up API!'); 
  })

app.get('/homepage', (req, res) => {
  res.send(findTopPosts())
})

app.get('/allposts', (req, res) => {
  res.send(getAllPosts())
})

app.get('/myjournal', (req, res) => {
  res.send(myPosts)
})


  module.exports = app
