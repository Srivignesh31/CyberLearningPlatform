// imports
const express = require('express')
const bodyParser = require("body-parser");
const path = require('path');
const multer = require("multer");
const File = require("./model/fileSchema");





const app = express();

var cors = require('cors');
app.use(cors());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// Configurations for "body-parser"
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );



//set views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))

//static files
app.use(express.static(`${__dirname}/public`))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))



const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  //Calling the "multer" Function
const upload = multer({
    storage: multerStorage
    // fileFilter: multerFilter,
  });
// const upload = multer({ dest: "public/files" });
app.get('',(req,res) => {
    res.render('index',{text: 'this is EJS' })
})
app.get('/about',(req,res) => {
    res.render('about',{text: 'About page' })
})
app.post("/api/uploadFile", upload.single("myFile"), async  (req, res) => {
    // Stuff to be added later
    console.log(req.file);
    try {
        const newFile = await File.create({
          name: req.file.filename,
          originalname:req.file.originalname,
          encoding:req.file.stream,
          mimetype:req.file.mimetype,
          destination:req.file.destination,
          path:req.file.path,
          size:req.file.size

        });
        res.status(200).json({
          status: "success",
          message: "File created successfully!!",
        });
      } catch (error) {
        res.json({
          error,
        });
      }
  });



app.get("/api/getFiles", async (req, res) => {
    try {
      const files = await File.find();
      res.status(200).json({
        status: "success",
        files,
      });
    } catch (error) {
      res.json({
        status: "Fail",
        error,
      });
    }
  });


  app.use('/',(req,res)=>{
    res.status(200).render('index');
});
//Express server
module.exports = app;


