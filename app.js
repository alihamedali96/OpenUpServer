const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())

const fs = require('fs')


function getAllPosts() {
    try {
    const allPostsString = fs.readFileSync('./allPosts.json', 'utf-8')
    const allPosts = JSON.parse(allPostsString)
    return allPosts
  } catch (err) {
    console.log(err)
  }
}

function findTopPosts() {
  try {
    const allPostsString = fs.readFileSync('./allPosts.json', 'utf-8')
    const allPosts = JSON.parse(allPostsString)
    let sortedPosts = allPosts.sort((a, b) => (a.interactions < b.interactions) ? 1 : -1)
    return sortedPosts.slice(0, 2)
  } catch (err) {
    console.log(err)
  }
}

function getMyPosts() {
  try {
  const myPostsString = fs.readFileSync('./myPosts.json', 'utf-8')
  const myPosts = JSON.parse(myPostsString)
  return myPosts
} catch (err) {
  console.log(err)
}
}

app.get('/', (req, res) => { 
    res.send('Welcome to our Open Up API!')
  })

app.get('/homepage', (req, res) => {
  res.send(findTopPosts())
})

app.get('/allposts', (req, res) => {
  res.send(getAllPosts())
})

app.get('/mypage', (req, res) => {
  res.send(getMyPosts())
})


module.exports = app
