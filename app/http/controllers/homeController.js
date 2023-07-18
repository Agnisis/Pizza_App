function homeController(){

    //factory functions pattern of programs
    return{
         index(req,res){

            
            res.render('home') 

         }
    }

}

module.exports=homeController