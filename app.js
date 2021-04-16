const express = require('express');
const bodyParser= require('body-parser');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');





const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function (req, file, callback) {
    let fileFormat = file.mimetype.split('/');
    callback(null, uuidv4() + '.' + fileFormat[fileFormat.length - 1]);
  }
});


const upload = multer({storage : storage});

app.post('/uploadfile' ,upload.single('myFile'),  (req, res) => {
    const file = req.file;
    console.log(file.mimetype);
    res.send(req.file);
    
});

app.get('/' , (req, res ) => {
    res.send(`

   <form action="/uploadfile" enctype="multipart/form-data" method="POST"> 
   <input type="file" name="myFile" />
   <input type="submit" value="submit"/>
   </form>
    `);
})

app.listen(3000);