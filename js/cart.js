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

let cartProductInLS = JSON.parse(localStorage.getItem("addedProduct"));
let displayProductInCart = document.querySelector("#cart__items");
// si le local storage renvoi un panier vide
if (cartProductInLS === null) {
  document.querySelector("h1").textContent = "Votre panier est vide";

  // si le panier contient un produit
} else {
  console.log(cartProductInLS);
  //on appelle les produits de l'API
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
      // on crée quelques vairiables et une boucle d'iteration
      const products = data;
      let numberOfProducts = cartProductInLS.length;
      let cart = [];
      for (i = 0; i < numberOfProducts; i++);
      {
        //on crée une boucle pour parcourir chaque produit de l'API
        for (let product of products) {
          // on crée une autre boucle pour parcourir les produits ajoutés au panier
          for (let cartProduct of cartProductInLS) {
            //  création de nouvelles variables //    je ne sais plus pourquoi c là?(cart.push(cartProductInLS);))
            let cartIdProduct = cartProduct.idProduct;
            let cartColorProduct = cartProduct.colorProduct;
            let cartQuantityProduct = cartProduct.quantityProduct;
            let display = "";
            // si les id de produits du panier correspondent aux id de produits d'API
            // récupérer les infos des produits sélectionnés + options choisies
            //  et afficher uniquement ces produits dans le panier
            if (cartIdProduct == product._id) {
              console.log(product.name, product.price);
              display += `
              <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${cartColorProduct}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : ${cartQuantityProduct}</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="0">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
              console.log(display);
            }
            document
              .querySelector("#cart__items")
              .insertAdjacentHTML("afterbegin", display);
          }
        }
      }
    });
}

/*let insertArticle = document.createElement("article");
              insertArticle.setAttribute("class", "cart__item");
              insertArticle.setAttribute("data-id", product._id);
              insertArticle.setAttribute("data-color", cartColorProduct);
              displayProductInCart.appendChild(insertArticle);

              let insertImage = document.createElement("img");
              insertImage.src = product.imageUrl;
              insertImage.alt = product.altTxt;
              insertArticle.appendChild(insertImage);

              let insertDescription = document.createElement("div");
              insertDescription.setAttribute(
                "class",
                "cart__item__content__description"
              );
              insertDescription.textContent = product.description;
              insertArticle.appendChild(insertDescription);

              let insertH2 = document.createElement("h2");
              insertH2.textContent = product.name;
              insertDescription.appendChild(insertH2);

              let insertPrice = document.createElement("p");
              insertPrice.textContent = product.price;
              insertDescription.appendChild(insertPrice);*/
