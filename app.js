const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const req = require('express/lib/request')
app.use(cors())
const fs = require('fs')

const allPostsString = fs.readFileSync('./allPosts.json', 'utf-8')
const allPosts = JSON.parse(allPostsString)
const myPostsString = fs.readFileSync('./myPosts.json', 'utf-8')
const myPosts = JSON.parse(myPostsString)


const path = require('path');
app.use(express.static(__dirname));

const bodyParser = require('body-parser');  // needed to read posted data
app.use(bodyParser.urlencoded({ extended: true }));

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

function findSearch(search) {
  try {
    const matches = allPosts.filter(element => {
      return (
          element.title.includes(search) ||
          element.text.includes(search) 
          )
      }) 
      return matches
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
//add a new post, checking if set to public or private
function addNewPost(newPost) {
  try {
    const postPublic = newPost.isPublic
    if(postPublic === true) {
      allPosts.unshift(newPost)
      myPosts.unshift(newPost)
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
    } if (postPublic === false) {
      myPosts.unshift(newPost)
      fs.writeFile('./myPosts.json', JSON.stringify(myPosts,null, 2),(err)=> {
        if(err){
            console.log(err);
        }
    })
  }} catch (err) {
    console.log(err)
}
}
//add new comment to post
function addComment(post) {
  try {
    const postMyIndex = myPosts.findIndex((element) => element.id === post.id)
  const postAllIndex = allPosts.findIndex((element) => element.id === post.id)
  // console.log(postMyIndex)
  // console.log(postAllIndex)
  if(postMyIndex !== -1 && postAllIndex !== -1) {
    const myPostsComments = myPosts[postMyIndex].comments
    myPostsComments.unshift(post.comments)
    console.log(myPostsComments)
    fs.writeFile('./myPosts.json', JSON.stringify(myPosts,null, 2),(err)=> {
      if(err){
          console.log(err);
      }
  })
  fs.writeFile('./allPosts.json', JSON.stringify(myPosts,null, 2),(err)=> {
    if(err){
        console.log(err);
    }
})
  }}catch (err) {
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
//routes
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


app.post('/post-test', (req, res) => {
    
  class newPost{
      // newPost constructor
      constructor(time, date, title, text, image_url, isPublic, interactions){
          this.time = time;
          this.date = date;
          this.title = title;
          this.text = text;
          this.image_url = image_url;
          var isTrueSet = (isPublic === 'true'); // string to boolean
          this.isPublic = isTrueSet;
          this.interactions = parseInt(interactions);
      };
  };

  let makeNewEntry = new newPost(req.body.time, req.body.date, req.body.title, req.body.text, req.body.image_url, req.body.isPublic, req.body.interactions);
  // console.log(makeNewEntry);


  const jsonData= require('./allPosts.json');
  // console.log(typeof jsonData);
  jsonData.push(makeNewEntry);

  var makeNewJson = JSON.stringify(jsonData, null, "\t"); // makes pretty

  var fs = require('fs');
  fs.writeFile('myjsonfileTEST.json', makeNewJson, err => {  // to test file
      if (err) {
        console.error(err);
      }
    });

  res.sendStatus(200);
});





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

app.get('/search', (req, res) => {
  const search = 'ipsum'
  res.send(findSearch(search))
})


app.patch('/homepage', (req, res) => {
  const newComment = req.body
  // const postToBeDeleted = req.body
  res.send(addComment(newComment))
})

app.patch('/allposts', (req, res) => {
  const newComment = req.body
  // const postToBeDeleted = req.body
  res.send(addComment(newComment))
})

module.exports = app
