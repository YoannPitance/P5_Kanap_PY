//Récupération du numero de comannde dans l url et affichage sur la page confirmation
const urlOrderId = new URLSearchParams(window.location.search).get("orderId");
const orderId = document.getElementById("orderId");
orderId.innerText = urlOrderId;
