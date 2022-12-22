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
