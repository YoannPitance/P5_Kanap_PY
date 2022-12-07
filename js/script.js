//récupérer les données de l'API

fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    displayProducts(data);
  })
  .catch((error) => {
    document.querySelector("h2").innerHTML =
      "<h2>Une erreur s'est produite: erreur 404</h2>";
  });

//injecter les infos articles dans le html pour afficher les produits sur la page
function displayProducts(products) {
  let baliseArticle = document.getElementById("items");
  for (let product of products) {
    baliseArticle.innerHTML += `<a href="./product.html?_id=${product._id}">
      <article>
        <img src="${product.imageUrl}" alt="${product.altTxt}">
        <h3 class=productName">${product.name}</h3>
        <p class=productDescription">${product.description}</p>
      </article>
    </a>`;
  }
}
