//nessasory imports o packages of nodejs 

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
const url = process.env.MONGO_DB_URI;
const passport=require('passport')
const Emitter=require('events')
const cors = require("cors");


// Mongo DB connection
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase this value
  socketTimeoutMS: 45000, // Increase this value
});

const connection = mongoose.connection;
connection.on('error', (err) => {
  console.error('Connection Failed:', err);
});
connection.once('open', () => {
  console.log('Database Connected to Mongo DB');
});

//event emitter
const eventEmitter=new Emitter()
app.set('eventEmitter',eventEmitter)  //bind with app 

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


//passport config 
const passportInit=require('./app/config/passport');
passportInit(passport)


//session middlewares
app.use(passport.initialize())
app.use(passport.session())


//global middelwere
app.use((req,res,next)=>{
   res.locals.session=req.session
   res.locals.user=req.user

   next()
})

//middlewares  setup 
// Assets 
app.use(express.static('public'));

//settemplate engine
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(expresslayout);
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs');


//routing setup
require('./routes/web')(app)


//server setup
const server=app.listen(PORT, () => {
  console.log('====================================');
  console.log(`listening on port  ${PORT}`);
  console.log("Backend server is running ");
  console.log('====================================');
})



//socket connection
const io=require('socket.io')(server)
io.on('connection',(socket)=>{
  //private rooms
  //join
  socket.on('join',(orderId)=>{
    
        socket.join(orderId)
  })
})
eventEmitter.on('orderUpdated',(data)=>{
  io.to(`order_${data.id}`).emit('orderUpdated',data)
})