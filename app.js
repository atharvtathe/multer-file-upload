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
    res.send(`
    <img src="/images/${file.filename}" alt="filename">
    `);

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