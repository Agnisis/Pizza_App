require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const expresslayout = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const path = require('path');
const initRoutes = require('./routes/web');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')
const url = 'mongodb://localhost:27017/Pizza';

// DB connection
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on('error', (err) => {
  console.error('Connection Failed:', err);
});

connection.once('open', () => {
  console.log('Database Connected');
});

// Session store
// const mongoStore = new MongoStore({
//   mongooseConnection: connection,
//   collection: 'sessions',
// });

// Session config
app.use(flash());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({mongoUrl:url}),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // valid for 24 hrs
    // cookie: { maxAge: 1000 *15 }, // valid for 24 hrs

  })
);


//global middelwere

app.use((req,res,next)=>{
   res.locals.session=req.session
   next()
})



// Assets 
app.use(express.static('public'));

//settemplate engine
app.use(express.json())
app.use(expresslayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');

// app.get('/',(req,res)=>{
//     // res.snde("Hello from server");
//     res.render('home');
//     })




// app.get('/cart',(req,res)=>{
// res.render('customers/cart')
// })



require('./routes/web')(app)

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`listening on port  ${PORT}`);
  console.log("its a fantastic server ");
  console.log('====================================');
})
