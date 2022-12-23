//declarer la balise cible où injecter les elements html
const insertElements = document.querySelector("#items");

//récupérer les données de l'API
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    const products = data;

    //injecter les infos articles dans le html pour afficher les produits sur la page
    //version 1
    /*for (let product of products) {
      let insertAnchor = document.createElement("a");
      insertAnchor.href = "./product.html?id=" + product._id;
      insertElements.appendChild(insertAnchor);

      let insertArticle = document.createElement("article");
      insertAnchor.appendChild(insertArticle);

      let insertImage = document.createElement("img");
      insertImage.src = product.imageUrl;
      insertImage.alt = product.altTxt;
      insertArticle.appendChild(insertImage);

      let insertH3 = document.createElement("h3");
      insertH3.setAttribute("class", "productName");
      insertH3.textContent = product.name;
      insertArticle.appendChild(insertH3);

      let insertPragraph = document.createElement("p");
      insertPragraph.setAttribute("class", "productDescription");
      insertPragraph.textContent = product.description;
      insertArticle.appendChild(insertPragraph);
    }*/
    //version 2
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
  .catch((error) => {
    document.querySelector("h2").textContent =
      "Une erreur s'est produite: erreur 404";
  });
