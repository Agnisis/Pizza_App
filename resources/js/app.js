import axios from "axios";
import Noty from "noty";
import moment from "moment";
import initAdmin from "./admin";
import {initStripe} from "./stripe"

let addToCart = document.querySelectorAll(".add-to-cart");
let cartCounter = document.querySelector("#cart-counter");


function updateCart(pizza) {
  //axios uses
  axios
    .post("/update-cart", pizza)
    .then((res) => {
      new Noty({
        type: "success",
        timeout: 1000,
        text: "Item Added To Cart",
        progressBar: false,
        // layout:'bottomLeft'
      }).show();

      cartCounter.innerText = res.data.totalQty;
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        text: "Something went Wrong",
        progressBar: false,
        // layout:'bottomLeft'
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
    // console.log(pizza);
  });
});

const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();

let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");
let statuses = document.querySelectorAll(".status_line");

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });

  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }

    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      status.classList.add("current");
      // if (status.nextElementSibling) {
      // }
    }
  });
}

updateStatus(order);


initStripe();



import io from "socket.io-client";
//socket
let socket = io();
//join

if (order) {
  socket.emit("join", `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  socket.emit("join", "adminRoom");
}

socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: "success",
    timeout: 1000,
    text: "Order Updated",
    progressBar: false,
    // layout:'bottomLeft'
  }).show();
});
