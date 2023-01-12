
// récupération des infos produits dans LS pour ajout dans page panier
let cartProductInLS = JSON.parse(localStorage.getItem("addedProduct"));
// Sélection de la balise de la page product.html
let displayProductInCart = document.querySelector("#cart__items");
//

//console.log(cartProductInLS);

//Déclaration des variables---------------------------------------------------------------------
let productsInCart = [];
function saveUpdatedCart() {
  localStorage.setItem("addedProduct", JSON.stringify(cartProductInLS));
}
//variables globales pour calculer la quantité d'articles et le prix total
let totalPrice = 0;
let totalQuantity = 0;
let cartQuantityProduct = 0;
let cartPriceProduct = 0;
let totalCartProductPrice = 0;
let myProducts = [];
const findProducts = 0;

//variables fonction supprimer
let idDelete = 0;
let colorDelete = 0;

//variables utilisées pour validation
const btnValidate = document.getElementById("order");
let firstNameError = true;
let lastNameError = true;
let addressError = true;
let cityError = true;
let emailError = true;

// récupération et Affichage des produits du LocalStorage
function messagePanierVide() {
  document.querySelector("h1").innerText = "Votre panier est vide";

  document.getElementById("totalQuantity").innerText = 0;
  document.getElementById("totalPrice").innerText = 0;
}
//Si panier vide (lS vide ou le tableau qu'il contient est vide) = msg panier vide
if (cartProductInLS === null || cartProductInLS.length === 0) {
  messagePanierVide();
  //Si click sur bouton commander, msg panier vide
  btnValidate.addEventListener("click", (event) => {
    alert("Votre panier est vide !");
    event.preventDefault();
  });
}

//Si panier contient un ou plusieurs articles = affichage produits selectionnés
else {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      myProducts = data;
      // recuperation options (couleur, quantité et l'id de tous les produits LS) et stockage dans les variables
      for (let i = 0; i < cartProductInLS.length; i++) {
        let cartColorProduct = cartProductInLS[i].colorProduct;
        let cartIdProduct = cartProductInLS[i].idProduct;
        cartQuantityProduct = cartProductInLS[i].quantityProduct;

        //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id lS
        const productsInCart = data.find(
          (element) => element._id === cartIdProduct
        );
        // console.log(productsInCart);
        // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
        cartPriceProduct = productsInCart.price;

        //insertion dans Balises html

        let display = "";
        display += `
          <article class="cart__item" data-id="${cartIdProduct}" data-color="${cartColorProduct}">
            <div class="cart__item__img">
              <img src="${productsInCart.imageUrl}" alt="${productsInCart.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${productsInCart.name}</h2>
                <p>${cartColorProduct}</p>
                <p>${productsInCart.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartQuantityProduct}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`;
        document
          .querySelector("#cart__items")
          .insertAdjacentHTML("afterbegin", display);

        totaux();
      }
      deleteProduct();
      changeQuantity();
    });

  //Fonctions
  //Calcul de la quantité total d'articles dans le panier
  function totalProductsQuantity() {
    totalQuantity += parseInt(cartQuantityProduct);
    console.log("quantité total d'article =", totalQuantity);
    document.getElementById("totalQuantity").innerText = totalQuantity;
  }

  //Calcul du montant total du panier
  function totalProductsPrice() {
    totalCartProductPrice = cartQuantityProduct * cartPriceProduct;
    // console.log(totalProductPricePanier);
    totalPrice += totalCartProductPrice;
    console.log("Prix total des articles du panier =", totalPrice);
    document.getElementById("totalPrice").innerText = totalPrice;
  }

  function totaux() {
    totalProductsQuantity();
    totalProductsPrice();
  }

  //màj la quantité total d'articles dans le panier après modification ou suppression
  function updateTotalQuantity() {
    let newTotalQuantity = 0;
    for (const item of cartProductInLS) {
      newTotalQuantity += parseInt(item.quantityProduct);
    }
    console.log("Mise à jour du nombre total de produits =", newTotalQuantity);

    document.getElementById("totalQuantity").innerText = newTotalQuantity;
  }

  //maj prix total du panier après modification ou suppression
  function updateTotalPrice() {
    let newTotalPrice = 0;
    //boucle sur le cartProductInLS +
    for (const item of cartProductInLS) {
      const cartIdProduct = item.idProduct;
      const quantityProductsInLS = item.quantityProduct;
      //... vérification correspondance des id
      const findProducts = myProducts.find((el) => el._id === cartIdProduct);
      //console.log(findProducts);
      //... si ok récupération du prix dans ls
      if (findProducts) {
        const newTotalCartProductPrice =
          findProducts.price * quantityProductsInLS;
        newTotalPrice += newTotalCartProductPrice;
        console.log("Nouveau prix total panier", newTotalPrice);
      }

      document.getElementById("totalPrice").innerText = newTotalPrice;
    }
  }

  //Modification quantité produit
  let errorQuantityMsg = false;
  function changeQuantity() {
    let changeQuantity = document.querySelectorAll(".itemQuantity");
    changeQuantity.forEach((item) => {
      item.addEventListener("change", (e) => {
        e.preventDefault();
        choiceQuantity = Number(item.value);

        let productInTagArticle = item.closest("article");
        //console.log(productInTagArticle);
        let pointArticleInLS = cartProductInLS.find(
          (el) =>
            el.idProduct === productInTagArticle.dataset.id &&
            el.colorProduct === productInTagArticle.dataset.color
        );
        // Si quantité comprise entre 1 et 100 et que c'est un nombre entier,...

        if (
          choiceQuantity > 0 &&
          choiceQuantity <= 100 &&
          Number.isInteger(choiceQuantity)
        ) {
          parseChoiceQuantity = parseInt(choiceQuantity);
          pointArticleInLS.quantityProduct = parseChoiceQuantity;
          //recalcul de la quantité et du prix total du panier
          updateTotalQuantity();
          updateTotalPrice();
          errorQuantityMsg = false;
        }
        // Sinon, aucun changement + msg erreur
        else {
          item.value = pointArticleInLS.quantityProduct;
          errorQuantityMsg = true;
        }
        if (errorQuantityMsg) {
          alert(
            "La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie."
          );
        }
      });
    });
  }

  //Suppression d'un produit
  function deleteProduct() {
    let productToDelete = document.querySelectorAll(".deleteItem");
    productToDelete.forEach((productToDelete) => {
      productToDelete.addEventListener("click", (e) => {
        e.preventDefault();

        let productInTagArticle = productToDelete.closest("article");
        console.log(productInTagArticle);

        cartProductInLS = cartProductInLS.filter(
          (el) =>
            el.idProduct !== productInTagArticle.dataset.id ||
            el.colorProduct !== productInTagArticle.dataset.color
        );

        saveUpdatedCart();

        alert("Ce produit a bien été supprimé du panier.");

        // suppression balise <article> du produit que l'on supprime depuis son parent
        if (productInTagArticle.parentNode) {
          productInTagArticle.parentNode.removeChild(productInTagArticle);
        }
        //Si panier vide (ou le tableau qu'il contient est vide)

        if (cartProductInLS === null || cartProductInLS.length === 0) {
          messagePanierVide();
        } else {
          updateTotalQuantity();
          updateTotalPrice();
          saveUpdatedCart();
        }
      });
    });
  }
  //Regex et récupération du formulaire

  //expressions regulieres pour chaque input
  let textRegex = new RegExp(
    "^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
  );
  let addressRegex = new RegExp(
    "^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
  );
  let emailRegex = new RegExp(
    "^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@]{1}[a-z0-9]+[.]{1}[a-z][a-z]+$"
  );

  //création des variables
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let address = document.getElementById("address");
  let city = document.getElementById("city");
  let email = document.getElementById("email");

  let checkFirstName;
  let checkLastName;
  let checkAddress;
  let checkCity;
  let checkEmail;

  // Vérification du prénom + message ok ou erreur
  firstName.addEventListener("change", function () {
    let firstNameErrorMsg = firstName.nextElementSibling;
    checkFirstName = textRegex.test(firstName.value);
    if (checkFirstName) {
      firstNameErrorMsg.innerText = "Tout est ok!";
      firstNameErrorMsg.style.color = "white";
      firstNameError = false;
    } else {
      firstNameErrorMsg.innerText = "Veuillez indiquer un prénom.";
      firstNameErrorMsg.style.color = "red";
      firstNameError = true;
    }
  });

  // Vérification du nom + message ok ou erreur
  lastName.addEventListener("change", function () {
    let lastNameErrorMsg = lastName.nextElementSibling;
    checkLastName = textRegex.test(lastName.value);
    if (checkLastName) {
      lastNameErrorMsg.innerText = "Tout est ok!";
      lastNameErrorMsg.style.color = "white";
      lastNameError = false;
    } else {
      lastNameErrorMsg.innerText = "Veuillez indiquer un nom de famille.";
      lastNameErrorMsg.style.color = "red";
      lastNameError = true;
    }
  });

  // Vérification de l'adresse + message ok ou erreur
  address.addEventListener("change", function () {
    let addressErrorMsg = address.nextElementSibling;
    checkAddress = addressRegex.test(address.value);
    if (checkAddress) {
      addressErrorMsg.innerText = "Tout est ok!";
      addressErrorMsg.style.color = "white";
      addressError = false;
    } else {
      addressErrorMsg.innerText = "Veuillez indiquer une adresse.";
      addressErrorMsg.style.color = "red";
      addressError = true;
    }
  });

  // Vérification de la ville + message ok ou erreur
  city.addEventListener("change", function () {
    let cityErrorMsg = city.nextElementSibling;
    checkCity = textRegex.test(city.value);
    if (checkCity) {
      cityErrorMsg.innerText = "tout est ok!";
      cityErrorMsg.style.color = "white";
      cityError = false;
    } else {
      cityErrorMsg.innerText = "Veuillez indiquer le nom d'une ville.";
      cityErrorMsg.style.color = "red";
      cityError = true;
    }
  });

  //  Vérification de l'email + message ok ou erreur
  email.addEventListener("change", function () {
    let emailErrorMsg = email.nextElementSibling;
    checkEmail = emailRegex.test(email.value);
    if (checkEmail) {
      emailErrorMsg.innerText = "Tout est ok!";
      emailErrorMsg.style.color = "white";
      emailError = false;
    } else {
      emailErrorMsg.innerText = "Veuillez renseigner un email correct.";
      emailErrorMsg.style.color = "red";
      emailError = true;
    }
  });

  // action du bouton de validation
  btnValidate.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    if (cartProductInLS === null || cartProductInLS.length === 0) {
      alert("Votre panier est vide !");
    } else {
      //enregistrement du formulaire et validation de la commande

      // verification que tous les champs soient bien renseignés, sinon msg erreur
      // verification qu'aucun champ n'est vide
      if (
        !firstName.value ||
        !lastName.value ||
        !address.value ||
        !city.value ||
        !email.value
      ) {
        alert("Vous devez renseigner tous les champs !");
        event.preventDefault();
      }
      // verification que les champs soient correctement remplis
      else if (
        firstNameError === true ||
        lastNameError === true ||
        addressError === true ||
        cityError === true ||
        emailError === true
      ) {
        alert(
          "Veuillez vérifier les champs du formulaire et les remplir correctement !"
        );
        event.preventDefault();
      } else {
        //Récupération des id des produits du panier, dans le localStorage
        let idProducts = [];
        for (let l = 0; l < cartProductInLS.length; l++) {
          idProducts.push(cartProductInLS[l].idProduct);
        }
        //console.log(idProducts);
        // création commande avec objet "Contact" + "Produits du panier"
        const order = {
          contact: {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
          },
          products: idProducts,
        };
        //console.log(order);
        // envoi des données de commande à l'api
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        };
        //console.log(options);
        fetch("http://localhost:3000/api/products/order", options)
          .then((response) => response.json())
          .then((data) => {
            //console.log(data);
            // redirection vers page de confirmation en passant l'orderId dans l'URL
            document.location.href = `confirmation.html?orderId=${data.orderId}`;
          })
          .catch((err) => {
            console.log("Erreur Fetch product.js", err);
            alert("Un problème a été rencontré lors de l'envoi du formulaire.");
          });
        // effacement du LS
        localStorage.clear();
      }
    }
  });
}