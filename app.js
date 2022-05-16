
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())




const fs = require('fs')

//get all posts from allPosts.json
function getAllPosts() {
    try {
    const allPostsString = fs.readFileSync('./allPosts.json', 'utf-8')
    const allPosts = JSON.parse(allPostsString)
    return allPosts
  } catch (err) {
    console.log(err)
  }
}
//find top 2 posts from allPosts.json
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
//get posts from myPosts.json
function getMyPosts() {
  try {
  const myPostsString = fs.readFileSync('./myPosts.json', 'utf-8')
  const myPosts = JSON.parse(myPostsString)
  return myPosts
} catch (err) {
  console.log(err)
}
}
//Started working on how to add new post using method in https://heynode.com/tutorial/readwrite-json-files-nodejs/, but may need to be just a post method instead

function addNewPost(newPost){
    try {
        const allPostsString = fs.readFileSync('./allPosts.json', 'utf-8')
        const allPosts = JSON.parse(allPostsString)
        allPosts.push(newPost)
    

        fs.writeFile('./allPosts.json',JSON.stringify(allPosts ,null, 2),(err)=> {
            if(err){
                console.log(err);
            }
        })

        

      } catch (err) {
        console.log(err)
}
}

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



const newPostString = JSON.stringify(newPost, null, 2)
// console.log(newPostString)

function addNewPrivatePost() {
  jsonReader('./myPosts.json', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      //not sure what to add here as posting entire new object
    }
  })
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

  let joke = '';