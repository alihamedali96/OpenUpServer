const app = require('./app');
const port = 3000;

app.listen(process.env.PORT||port, () => { //starts port
    console.log(`Example app listening on port ${port}`)
  })

 