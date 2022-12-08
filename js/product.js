//récuparation de l'id produit dans l'url

const urlId = new URLSearchParams(document.location.search);
const id = urlId.get("_id");

//recuperation des infos produits

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    displayProducts(data);
  })
  .catch((error) => {
    alert("Une erreur s'est produite: erreur 404");
  });

//affichage données du produit
//déclaration element produit pour html

let thisProduct = {};
thisProduct._id = id;
function displayProducts(products) {
  let name = document.getElementById("title"),
    imageUrl = document.querySelector("article div.item__img"),
    price = document.getElementById("price"),
    description = document.getElementById("description"),
    colors = document.getElementById("colors");

  // boucle affichage des détails produits en fonction du produit selectionné

  for (let whichOne of products) {
    if (id === whichOne._id) {
      pageName.textContent = `${whichOne.pageName}`;
      name.textContent = `${whichOne.name}`;
      imageUrl.innerHTML = `<img src="${whichOne.imageUrl}" alt="${whichOne.altTxt}">`;
      price.textContent = `${whichOne.price}`;
      description.textContent = `${whichOne.description}`;
    }
  }
}
