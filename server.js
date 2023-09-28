const express = require('express');
const path = require('path');
const app = express();
const hbs = require('express-handlebars');
const multer = require('multer')

app.engine('.hbs', hbs());
app.set('view engine', '.hbs');


app.use(express.static(path.join(__dirname, '/public'))); // required to make the public folder accessible
app.use(express.urlencoded({ extended: false })); // required to handle urlencode requests
app.use(express.json()); // required to handle form-data request (optional in this project)



let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.originalname + '-' + Date.now() + '.' + extension)
  }
})
const upload = multer({ storage: storage })

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact/send-message', upload.single('uploaded_file'), (req, res) => {

  const { author, sender, title, message } = req.body;
  console.log(req.file)

  if (author && sender && title && message && req.file) {
    const originalname = req.file.originalname;
    res.render('contact', { isSent: true, originalname });
  }
  else {
    res.render('contact', { isError: true });
  }

});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { name: req.params.name });
});


app.use((req, res) => {
  res.status(404).send('404 not found...');
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});