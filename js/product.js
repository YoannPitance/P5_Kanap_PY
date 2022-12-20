//récuparation de l'id produit dans l'url

const urlId = new URLSearchParams(window.location.search).get("id");

//récupération des données correspondant à l'id récupéré

fetch(`http://localhost:3000/api/products/${urlId}`)
  .then((res) => res.json())
  .then((chosenProduct) => {
    //Affichage du produit demandé et remplissage des zones html avec les données de l'api

    document.title = chosenProduct.name; // donne la data "name" au titre de la page
    const img = document.createElement("img");
    img.src = chosenProduct.imageUrl;
    img.alt = chosenProduct.altTxt;
    document.getElementsByClassName("item__img")[0].appendChild(img);
    document.getElementById("title").textContent = chosenProduct.name;
    document.getElementById("price").textContent = chosenProduct.price + " ";
    document.getElementById("description").textContent =
      chosenProduct.description;

    // Boucle forEach pour le choix des couleurs
    chosenProduct.colors.forEach((color) => {
      const option = document.createElement("option");
      const select = document.getElementById("colors");
      option.value = color; // attribution de "color" comme valeur de <option>
      option.textContent = color;
      select.appendChild(option); // <option> est créé comme enfant de <select>
    });

    // Récupération des données sélectionnées par l'utilisateur pour l'envoi vers le panier

    //Sélection du bouton Ajouter au panier puis.....
    const validateBtn = document.querySelector("#addToCart");
    const selectedColor = document.querySelector("#colors");
    const quantity = document.querySelector("#quantity");
    validateBtn.addEventListener("click", (e) => {
      e.preventDefault;
      whatColor = selectedColor.value;
      howMany = Number(quantity.value);

      if (
        whatColor !== "" &&
        howMany > 0 &&
        howMany <= 100 &&
        Number.isInteger(howMany)
      ) {
        let settingsProduct = {
          idProduct: chosenProduct._id,
          colorProduct: whatColor,
          quantityProduct: howMany,
        };
        let updateLS = false;
        let saveCartToLS = () => {
          let findProduct = cartProductInLS.find((x) => {
            return (
              x.idProduct === settingsProduct.idProduct &&
              x.colorProduct === settingsProduct.colorProduct
            );
          });
          if (findProduct) {
            let total =
              Number(findProduct.quantityProduct) +
              Number(settingsProduct.quantityProduct);
            if (total <= 100) {
              updateLS = false;
              findProduct.quantityProduct =
                Number(findProduct.quantityProduct) +
                Number(settingsProduct.quantityProduct);
              alert(
                `La quantité du produit ${chosenProduct.name} et la couleur ${whatColor} ont bien été mis à jour`
              );
            } else {
              updateLS = false;
              alert(
                "Erreur de saisie sur la quantité, veuillez entrer une quantité comprise entre 1 et 100"
              );
            }
          } else {
            updateLS = true;
            cartProductInLS.push(settingsProduct);
          }
          localStorage.setItem("addedProduct", JSON.stringify(cartProductInLS));
        };
        let cartProductInLS = JSON.parse(localStorage.getItem("addedProduct"));
        if (cartProductInLS) {
          saveCartToLS();
          console.log(cartProductInLS);
        } else {
          cartProductInLS = [];
          saveCartToLS();
          console.log(cartProductInLS);

          updateLS = false;
          alert(`Votre article a bien été ajouté au panier`);
        }
        if (updateLS) {
          alert(
            `Le produit ${chosenProduct.name} de couleur ${whatColor} a bien été ajouté au panier`
          );
        }
      } else {
        alert(
          `Erreur, un des champs n'est pas correctement rempli ou selectionné, veuillez verifier la couleur et la quantité`
        );
      }
    });
  })
  .catch((error) => {
    alert("erreur de récupération des données: l'id du produit est incorrect");
    error;
  });

/*1 créer le tableau sur page produit 
2 ajouter le tableau dan le localstorage
3 recuperer les infos quantité id, couleur dans une variable et verifier si les elements ne sont deja pas exisrtant sinon mise à jour qté seulement
4 recuperation sur la page panier
5 vérications des données personnelles 
 
click sur valider*/
