//Récupération du numero de comannde dans l url et affichage sur la page confirmation
const urlOrderId = new URLSearchParams(window.location.search).get("orderId");
if (urlOrderId === null || urlOrderId === "") {
  alert(
    "Une erreur s'est produite lors de la validation de votre commande. Veuillez nous en excuser !"
  );
  window.location.href = "index.html";
} else {
  const orderId = document.getElementById("orderId");
  orderId.innerText = urlOrderId;
  console.log(idCommande);
}
