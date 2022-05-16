
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const fs = require('fs')

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
      myPosts.push(newPost)
      fs.writeFile('./allPosts.json', JSON.stringify(allPosts,null, 2),(err)=> {
          if(err){
              console.log(err);
          }
      })
      fs.writeFile('./myPosts.json', JSON.stringify(myPosts,null, 2),(err)=> {
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
      const postIndex = myPosts.findIndex((element) => element.id === post.id)
      if(postIndex === -1) {
        throw new Error('this post does not exist')
      } else {
        const filteredPosts = myPosts.filter(
          (element) => element.id !== post.id
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
      const postIndex = allPosts.findIndex((element) => element.id === post.id)
      if(postIndex === -1) {
        throw new Error('this post does not exist')
      } else {
        const filteredPosts = allPosts.filter(
          (element) => element.id !== post.id
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

app.get('/', (req, res) => { 
    res.status(200).send('Welcome to our Open Up API!')
  })

app.get('/homepage', (req, res) => {
  res.status(200).send(findTopPosts())
})

app.get('/allposts', (req, res) => {
  res.status(200).send(getAllPosts())
})

app.get('/mypage', (req, res) => {
  res.status(200).send(getMyPosts())
})

app.post('/mypage', (req, res) => {
    const newPost = req.body
    res.status(201).send(addNewPost(newPost))
})

//Delete own post, which deletes from both allPosts and myPosts
app.delete('/mypage', (req, res) => {
  try {
    const postToBeDeleted = req.body
    const filteredMyData = deleteMyPost(postToBeDeleted)
    const filteredAllData = deleteAPost(postToBeDeleted)
    if (!filteredMyData || !filteredAllData) {
      throw new Error('this post does not exist')
    } else {
      res.status(200).send(filteredMyData)
      res.status(200).send(filteredAllData)
    }
  } catch (err) {
    res.status(404).send({ error: err.message })
  }
})

module.exports = app