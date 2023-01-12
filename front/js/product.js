//récuparation de l'id produit dans l'url
const urlId = new URLSearchParams(window.location.search).get("id");

//récupération des données correspondant à l'id récupéré
fetch(`http://localhost:3000/api/products/${urlId}`)
  .then((res) => res.json())
  .then((chosenProduct) => {

    //Affichage du produit demandé et remplissage des zones html avec les données de l'api
    document.title = chosenProduct.name;
    const img = document.createElement("img");
    img.src = chosenProduct.imageUrl;
    img.alt = chosenProduct.altTxt;
    document.getElementsByClassName("item__img")[0].appendChild(img);
    document.getElementById("title").textContent = chosenProduct.name;
    document.getElementById("price").textContent = chosenProduct.price + " ";
    document.getElementById("description").textContent =
      chosenProduct.description;

    // Boucle forEach pour le choix des couleurs dans les options
    chosenProduct.colors.forEach((color) => {
      const option = document.createElement("option");
      const select = document.getElementById("colors");
      option.value = color; // attribution de "color"(données API) comme valeur de <option>
      option.textContent = color;
      select.appendChild(option); // <option> est créé comme enfant de <select>
    });
    
    // Récupération des otpions du produit pour l'ajout au panier

    //Ecoute au click du bouton valider + création de variables pour les options sélectionnées
    const validateBtn = document.querySelector("#addToCart");
    const selectedColor = document.querySelector("#colors");
    const quantity = document.querySelector("#quantity");
    validateBtn.addEventListener("click", (e) => {
      e.preventDefault;
      whatColor = selectedColor.value;
      howMany = Number(quantity.value);

      // condition de récupération des otpions choisies
      if (
        whatColor !== "" &&
        howMany > 0 && 
        howMany <= 100 && 
        Number.isInteger(howMany) 
      ) {
        // création de l'objet correspondant aux options choisies du produit
        let settingsProduct = {
          idProduct: chosenProduct._id,
          colorProduct: whatColor,
          quantityProduct: howMany,
        };
        // création d'une variable pour afficher des alertes à chaque mise à jour de produit
        let updateLS = false;
        // fonction de sauvegarde du panier dans le local storge
        let saveCartToLS = () => {
          // recherche si le produit est déja existant dans le panier si oui seule la quantité doit être ajoutée
          let findProduct = cartProductInLS.find((x) => {
            return (
              x.idProduct === settingsProduct.idProduct &&
              x.colorProduct === settingsProduct.colorProduct
            );
          });
          //  produit identique existant donc
          if (findProduct) {
            let total =
              Number(findProduct.quantityProduct) +
              Number(settingsProduct.quantityProduct);
            if (total <= 100) {
              updateLS = false;
              findProduct.quantityProduct =
                Number(findProduct.quantityProduct) +
                Number(settingsProduct.quantityProduct);
              // message de mise à jour quantité produit si choisie entre 1 et 100
              alert(
                `La quantité du produit ${chosenProduct.name} de couleur ${whatColor} a bien été mise à jour`
              );
            } else {
              updateLS = false;
              // sinon message erreur de saisie de la quantité
              alert(
                "Erreur de saisie sur la quantité, veuillez entrer une quantité comprise entre 1 et 100"
              );
            }
            // produit identique inexistant dans le panier donc création produit avec options choisies dans une variable
          } else {
            updateLS = true;
            cartProductInLS.push(settingsProduct);
          }
          // conversion au format JSON des données pour sauvegarde dans LS avec la clé "addedProduct"
          localStorage.setItem("addedProduct", JSON.stringify(cartProductInLS));
        };
        let cartProductInLS = JSON.parse(localStorage.getItem("addedProduct"));
        // si "addedProduct" est déjà présent dans LS alors utilisation de la fonction de mise à jour "saveCartoLS"
        if (cartProductInLS) {
          saveCartToLS();
          console.log(cartProductInLS);
          // sinon ajout du produit et affichage d'un message de confirmation d'ajout d'un 1er produit
        } else {
          cartProductInLS = [];
          saveCartToLS();
          console.log(cartProductInLS);

          updateLS = false;
          alert(
            `Bravo, votre premier article ${chosenProduct.name} de couleur ${whatColor} a bien été ajouté au panier`
          );
        }
        // si un 1 er produit existe déja alors message différent pour ajout d'un nouveau produit
        if (updateLS) {
          alert(
            `Le produit ${chosenProduct.name} de couleur ${whatColor} a bien été ajouté au panier`
          );
        }
        // en cas d'options mal sélectionnées ou mal renseigné, un message d'esrreur s'affiche.
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
