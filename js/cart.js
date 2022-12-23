/*1- recuperer les donnees dans ls
  2- recuperer donnees api
  3- comparer les donnees ls et api
  4- avec id produits ls afficher caracteristiques produits de l'api
  5- injecter dans le html
  6- calcul du prix total de chaque article en fonction de la quantité
  7- calcul prix total du panier
  8- function mise à jour, retirer/ajouter une quantité ou un supprimer id
  9- verification de formulaire
  */

// récupération des infos produits dans LS pour ajout dans page panier

const numberOfProducts = localStorage.length;
console.log(numberOfProducts);
const cart = [];

for (let i = 0; i < numberOfProducts; i++) {
  let cartProductInLS = JSON.parse(localStorage.getItem("addedProduct"));
  cart.push(cartProductInLS);
  console.log(cartProductInLS);
  console.log(cart);

  // affichage des produits dans le panier
  const displayProductInCart = document.querySelector("#cart__items");
  console.log(displayProductInCart);

  // si le panier est vide

  if (cartProductInLS === null) {
    document.querySelector("h1").textContent = "Votre panier est vide";
    // si le panier contient un produit
  } else {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((products) => {
        console.log(products);
      });
  }
}
