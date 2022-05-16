const express = require('express');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors()) ;

app.get('/', (req, res) => { 
    res.send('Welcome to our Open Up API!'); 
  })

  module.exports = app;
