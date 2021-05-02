const express = require('express');
const bodyParser= require('body-parser');
const multer  = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');




const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/images',express.static('uploads'));

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    // callback(null, __dirname + '/uploads');
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    let fileFormat = file.mimetype.split('/');
    callback(null, uuidv4() + '.' + fileFormat[fileFormat.length - 1]);
  }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
}

const upload = multer({storage : storage, fileFilter : fileFilter});

app.post('/uploadfile' ,upload.single('myFile'),  (req, res) => {
    const file = req.file;
    // console.log(file.mimetype);
    // res.send(req.file);
    // <img src="/images/${file.filename}" alt="filename">
    res.send(`
    
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>file</title>
    <style>
      img {
        display: block;
        margin: auto;
        max-width: 500px;
        height: auto;
      }
      h1 {
        text-align : center;
      }
    </style>
  </head>
  <body>
  <h1>Uploaded Image</h1>
    <img src="/images/${file.filename}" alt="filename" />
  </body>
</html>
    `);

});

app.get('/' , (req, res ) => {
    res.send(`

   <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>file uploader</title>
    <style>
        div {
            margin-top : 100px;
            text-align: center;
        }
         h1 {
        text-align : center;
      }
      
    </style>
  </head>
  <body>
  <h1> File uploader</h1>
  <div>
   <form action="/uploadfile" enctype="multipart/form-data" method="POST"> 
   <input type="file" name="myFile" />
   <input type="submit" value="submit"/>
   </form>
   </div>
  </body>
</html>
    `);
})

const port = process.env.PORT || 3000;

app.listen(port);