import axios from 'axios'
import Noty from 'noty'
import initAdmin from './admin'
let addToCart = document.querySelectorAll('.add-to-cart')

let cartCounter=document.querySelector('#cart-counter')





function updateCart(pizza){

    //axios uses
    axios.post('/update-cart',pizza).then(res=>{
        new Noty({
            type:'success',
            timeout:1000,
            text: "Item Added To Cart",
            progressBar:false,
            // layout:'bottomLeft'
          }).show();

        cartCounter.innerText=res.data.totalQty;
    }) .catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text: "Something went Wrong",
            progressBar:false,
            // layout:'bottomLeft'
          }).show();
    })
    

}

addToCart.forEach((btn) => {


                btn.addEventListener('click', (e) => {

                    let pizza=JSON.parse(btn.dataset.pizza)
                    updateCart(pizza)
                    // console.log(pizza);
                })
            })
        

const alertMsg=document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

initAdmin()

