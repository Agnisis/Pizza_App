const express=require('express');
const app=express();
const ejs=require('ejs');
const expresslayout=require('express-ejs-layouts');
const PORT=process.env.PORT || 3000;
const path =require('path');



// Assets 
app.use(express.static('public'));

app.get('/',(req,res)=>{
// res.snde("Hello from server");
res.render('home');
})




//settemplate engine

app.use(expresslayout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');
app.listen(PORT,()=>{
    console.log('====================================');
    console.log(`listening on port  ${PORT}`);
    console.log("its a fantastic server ");
    console.log('====================================');
})
