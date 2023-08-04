const express=require('express');
const app=express();
const ejs=require('ejs');
const expresslayout=require('express-ejs-layouts');
const PORT=process.env.PORT || 3000;
const path =require('path');
const initRoutes = require('./routes/web');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/Pizza';


//db connection
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


// Assets 
app.use(express.static('public'));

//settemplate engine

app.use(expresslayout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');

// app.get('/',(req,res)=>{
//     // res.snde("Hello from server");
//     res.render('home');
//     })




// app.get('/cart',(req,res)=>{
    // res.render('customers/cart')
    // })
    
   
            
            require('./routes/web')(app)
    
app.listen(PORT,()=>{
    console.log('====================================');
    console.log(`listening on port  ${PORT}`);
    console.log("its a fantastic server ");
    console.log('====================================');
})
