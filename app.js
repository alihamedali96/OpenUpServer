
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const fs = require('fs')
const { all } = require('express/lib/application')

const allPostsString = fs.readFileSync('./allPosts.json', 'utf-8')
const allPosts = JSON.parse(allPostsString)
const myPostsString = fs.readFileSync('./myPosts.json', 'utf-8')
const myPosts = JSON.parse(myPostsString)

//get all posts from allPosts.json
function getAllPosts() {
    try {
    return allPosts
  } catch (err) {
    console.log(err)
  }
}
//find top 2 posts from allPosts.json
function findTopPosts() {
  try {
    let sortedPosts = allPosts.sort((a, b) => (a.interactions < b.interactions) ? 1 : -1)
    return sortedPosts.slice(0, 2)
  } catch (err) {
    console.log(err)
  }
}
//get posts from myPosts.json
function getMyPosts() {
  try {
    return myPosts
  } catch (err) {
    console.log(err)
  }
}

function addNewPost(newPost){
  try {
      allPosts.push(newPost)
      fs.writeFile('./allPosts.json', JSON.stringify(allPosts,null, 2),(err)=> {
          if(err){
              console.log(err);
          }
      })
    } catch (err) {
      console.log(err)
  }
}
//Delete a post from myPosts
function deleteMyPost(post){
  try {
      const postTitle = post.title
      const postIndex = myPosts.findIndex((element) => element.title === postTitle)
      if(postIndex === -1) {
        throw new Error('this post does not exist')
      } else {
        const filteredPosts = myPosts.filter(
          (element) => element.title !== post.title
        )
        fs.writeFile('./myPosts.json', JSON.stringify(filteredPosts, null, 2), (err) => {
          if (err) {
            console.log(err)
          }
        })
        return filteredPosts
      }
    } catch (err) {
      console.log(err)
  }
}
//Delete a post from allPosts
function deleteAPost(post){
  try {
      const postTitle = post.title
      const postIndex = allPosts.findIndex((element) => element.title === postTitle)
      if(postIndex === -1) {
        throw new Error('this post does not exist')
      } else {
        const filteredPosts = allPosts.filter(
          (element) => element.title !== post.title
        )
        fs.writeFile('./allPosts.json', JSON.stringify(filteredPosts, null, 2), (err) => {
          if (err) {
            console.log(err)
          }
        })
        return filteredPosts
      }
    } catch (err) {
      console.log(err)
  }
}
//Delete own post, which deletes from both allPosts and myPosts
app.delete('/mypage', (req, res) => {
  try {
    const postToBeDeleted = req.body
    const filteredMyData = deleteMyPost(postToBeDeleted)
    if (!filteredMyData) {
      throw new Error('this post does not exist')
    } else {
      res.status(200).send(filteredMyData)
    }
    const filteredAllData = deleteAPost(postToBeDeleted)
    if (!filteredAllData) {
      throw new Error('this post does not exist')
    } else {
      res.status(200).send(filteredAllData)
    }
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
})

const newPost = {
    time: "",
    date: "",
    title: "",
    text: "",
    image_url: "",
    public: null,
    interactions: 0,
    comments: []
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

app.post('/allposts', (req, res) => {
    const newPost = req.body
    res.send(addNewPost(newPost))
})

module.exports = app