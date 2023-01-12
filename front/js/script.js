//declarer la balise cible où injecter les elements html
const insertElements = document.querySelector("#items");

//récupérer les données de l'API
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    const products = data;

    //injecter les infos articles dans le html pour afficher les produits sur la page   
    let display = "";
    for (product of products) {
      display += `
        <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
        </a>`;
      console.log(display);
    }
    document.querySelector("#items").insertAdjacentHTML("afterbegin", display);
  })

  // en cas d'erreur de chargement ou d'execution du code
  .catch((error) => {
    document.querySelector("h2").textContent =
      "Une erreur s'est produite: erreur 404";
  });
