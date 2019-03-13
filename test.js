const express = require('express')
var cors = require('cors')
const app = express()
let multer = require('multer');
let upload = multer();

app.use(cors())

const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/po', upload.any(), (req, res) => {
    let formData = req.body;
    console.log(req.body)
    console.log('form data', formData);
    res.sendStatus(200);
  });


app.listen(port, () => console.log(`Example app listening on port ${port}!`))