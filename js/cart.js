/*1- recuperer les donnees dans ls  _______________________________________// OK
  2- recuperer donnees api          _______________________________________// OK
  3- comparer les donnees ls et api _______________________________________// OK
  4- avec id produits ls afficher caracteristiques produits de l'api ______// OK
  5- injecter dans le html          _______________________________________// OK
  6- calcul du prix total panier en fonction de la quantité________________// OK  
  7- function mise à jour, retirer/ajouter une quantité ou un supprimer id_// OK
  8- verification de formulaire au click
  9- bouton valider + envoi données à l'API avec POST
  */

// récupération des infos produits dans LS pour ajout dans page panier
let cartProductInLS = JSON.parse(localStorage.getItem("addedProduct"));
//--------------------Sélection de la balise de la page product.html dans laquel on va insérer les produits et leurs infos-------------------------
let displayProductInCart = document.querySelector("#cart__items");
//

//console.log(cartProductInLS);--------------

//_______________________________________________Déclaration des variables________________________________________________________________________
let productsInCart = [];
function saveUpdatedCart() {
  localStorage.setItem("addedProduct", JSON.stringify(cartProductInLS));
}
//-------------------------variables globales pour pouvoir calculer la quantité total d'articles et le prix total du panier----------------------
let totalPrice = 0;
let totalQuantity = 0;
let cartQuantityProduct = 0;
let cartPriceProduct = 0;
let totalCartProductPrice = 0;
let myProducts = [];
const findProducts = 0;

//-------------------------------------------------variables utilisées dans le fonction supprimer---------------------------------------------
let idDelete = 0;
let colorDelete = 0;

//-------------------------------------------------variables utilisées pour la validation du panier--------------------------------------------
const btnValidate = document.getElementById("order");
let firstNameError = true;
let lastNameError = true;
let addressError = true;
let cityError = true;
let emailError = true;

//__________________________________________________Affichage des produits du LocalStorage__________________________________________________________
function messagePanierVide() {
  document.querySelector("h1").innerText = "Votre panier est vide";

  document.getElementById("totalQuantity").innerText = 0;
  document.getElementById("totalPrice").innerText = 0;
}
//--------------Si le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide), on affiche "Le panier est vide"------------
if (cartProductInLS === null || cartProductInLS.length === 0) {
  messagePanierVide();
  //Si click sur bouton commander, msg panier est vide
  btnValidate.addEventListener("click", (event) => {
    alert("Votre panier est vide !");
    event.preventDefault();
  });
}

//-----------------------------------Si le panier n'est pas vide alors, on affiche le contenu du localStorage-------------------------------------
else {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      myProducts = data;
      // recuperation la couleur, la quantité et l'id de tous les produits contenus dans le localstorage et on les met dans des variables
      for (let i = 0; i < cartProductInLS.length; i++) {
        let cartColorProduct = cartProductInLS[i].colorProduct;
        let cartIdProduct = cartProductInLS[i].idProduct;
        cartQuantityProduct = cartProductInLS[i].quantityProduct;

        //on ne récupère que les données des canapés dont _id (de l'api) correspondent à l'id localStorage
        const productsInCart = data.find(
          (element) => element._id === cartIdProduct
        );
        // console.log(productsInCart);
        // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
        cartPriceProduct = productsInCart.price;

        //_________________________________________Ajout Balises html_______________________________________________________________

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
      //___________________________________________Appel de la fonction Supprimer un produit__________________________________________________________
      deleteProduct();
      //_____________________________________Appel de le fonction Modifier la quantité d'un produit____________________________________________________
      changeQuantity();
    });

  //_____________________________________________________________Fonctions_____________________________________________________________________
  //----------------------Fonction Calcul de la quantité total d'articles dans le panier, au chargement de la page Panier.html-----------------
  function totalProductsQuantity() {
    totalQuantity += parseInt(cartQuantityProduct);
    console.log("quantité total d'article =", totalQuantity);
    document.getElementById("totalQuantity").innerText = totalQuantity;
  }

  //-------------------------------Fonction Calcul du montant total du panier, au chargement de la page Panier.html-------------------------------

  function totalProductsPrice() {
    // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalCartProductPrice = cartQuantityProduct * cartPriceProduct;
    // console.log(totalProductPricePanier);
    // Calcul du prix total du panier
    totalPrice += totalCartProductPrice;
    console.log("Prix total des articles du panier =", totalPrice);
    document.getElementById("totalPrice").innerText = totalPrice;
  }

  function totaux() {
    totalProductsQuantity();
    totalProductsPrice();
  }

  //---Fonction Recalcul de la quantité total d'articles dans le panier, lors de la modification de la quantité ou de la suppression d'un article---
  function updateTotalQuantity() {
    let newTotalQuantity = 0;
    for (const item of cartProductInLS) {
      newTotalQuantity += parseInt(item.quantityProduct);
    }
    console.log("Mise à jour du nombre total de produits =", newTotalQuantity);

    document.getElementById("totalQuantity").innerText = newTotalQuantity;
  }

  //----------Fonction maj du montant total du panier, lors de la modification de la quantité ou de la suppression d'un article-------------
  function updateTotalPrice() {
    let newTotalPrice = 0;
    //(1) On fait une boucle sur le productRegisterInLocalStorage et dans cette boucle,
    for (const item of cartProductInLS) {
      const cartIdProduct = item.idProduct;
      const quantityProductsInLS = item.quantityProduct;
      //(2) on vérifie si l'id correspond
      const findProducts = myProducts.find((el) => el._id === cartIdProduct);
      //console.log(findProducts);
      //(3) et si c'est le cas, on récupère le prix.
      if (findProducts) {
        const newTotalCartProductPrice =
          findProducts.price * quantityProductsInLS;
        newTotalPrice += newTotalCartProductPrice;
        console.log("Nouveau prix total panier", newTotalPrice);
      }

      document.getElementById("totalPrice").innerText = newTotalPrice;
    }
  }

  //----------------------------------Fonction Modifier la quantité d'un article du panier--------------------------------------------------
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

        // Si la quantité est comprise entre 1 et 100 et que c'est un nombre entier,...

        if (
          choiceQuantity > 0 &&
          choiceQuantity <= 100 &&
          Number.isInteger(choiceQuantity)
        ) {
          parseChoiceQuantity = parseInt(choiceQuantity);
          pointArticleInLS.quantityProduct = parseChoiceQuantity;
          // Et, on recalcule la quantité et le prix total du panier
          updateTotalQuantity();
          updateTotalPrice();
          errorQuantityMsg = false;
        }
        // Sinon, aucun changemeny + msg erreur
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

  //----------------------------------Fonction Suppression d'un article du panier--------------------------------------------------
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

        // On supprime physiquement la balise <article> du produit que l'on supprime depuis son parent, si elle existe
        if (productInTagArticle.parentNode) {
          productInTagArticle.parentNode.removeChild(productInTagArticle);
        }
        //-----Si panier vide (ou le tableau qu'il contient est vide),...

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

      // On vérifie que tous les champs sont bien renseignés, sinon on indique un message à l'utilisateur
      // On vérifie qu'aucun champ n'est vide
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
      // On vérifie que les champs sont correctement remplis suivant les regex mises en place
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
      }
    }
  });
}

/*let productsInCart = [];
let totalPrice = 0;
let totalQuantity = 0;
let cartQuantityProduct = 0;
let cartPriceProduct = 0;
let totalCartProductPrice = 0;
let myProducts = [];
const findProducts = 0;
//

let deletById = 0;
let deleteByColor = 0;
//

const btnValidate = document.getElementById("order");
//

let firstNameError = true;
let lastNameError = true;
let adressError = true;
let cityError = true;
let emailError = true;
//

function totalProductsQuantity() {
  totalQuantity += parseInt(cartQuantityProduct);
  console.log("quantité de produit total", totalQuantity);
  document.getElementById(totalQuantity).innerText = totalQuantity;
}*/
// si le local storage renvoi un panier vide

/*let btnDeleteItem = document.querySelectorAll(".deleteItem");
        console.log(btnDeleteItem);

        for (let k = 0; k < btnDeleteItem.length; k++) {
          btnDeleteItem[k].addEventListener("click", (e) => {
            e.preventDefault();

            let deleteIdClicked = cartProductInLS[k].idProduct;
            console.log(deleteIdClicked);

            cartProductInLS = cartProductInLS.filter(
              (el) => el.idProduct == deleteIdClicked
            );
            console.log(cartProductInLS);
            localStorage.setItem(
              "addedProduct",
              JSON.stringify(cartProductInLS)
            );

            alert(`Ce produit a bien été supprimé du panier`);
            window.location.href = "cart.html";
          });
        }*/

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
