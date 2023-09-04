import { loadStripe } from "@stripe/stripe-js/pure";
import { placeOrder } from "./apiService";
export async function initStripe() {
  // Stripe.js will not be loaded until `loadStripe` is called
  const stripe = await loadStripe(
    "pk_test_51NlD9GSAYtIokhNgFYfecUR1KS0nc8ynTP8dk6xRdFjx7hwAqOq6g1b3ko7bNsJzywXRJ4oocdD3gqiwQNyQ7D4x00vhJ0Ls03"
  );
  let card = null;
  function mountWidget() {
    let style = {
      base: {
        color: "#32325d",
        fontFamily: "sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };
    const elements = stripe.elements();
    card = elements.create("card", { style, hidePostalCode: true });
    card.mount("#card-element");
  }

  const paymentType = document.querySelector("#paymentType");
  if (!paymentType) {
    return;
  }
  paymentType.addEventListener("change", (e) => {
    console.log(e.target.value);
    if (e.target.value == "card") {
      mountWidget();
    } else {
      card.destroy();
    }
  });

  //Ajax Call for form submit to order data for payement

  const paymentForm = document.querySelector("#payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      if (!card) {
        //ajax
        placeOrder(formObject);
        return;
      }
      //verify card
      stripe
        .createToken(card)
        .then((result) => {
        formObject.stripeToken=result.token.id      
        placeOrder(formObject);

        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}


