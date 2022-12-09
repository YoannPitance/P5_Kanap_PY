//récuparation de l'id produit dans l'url

const urlId = new URLSearchParams(window.location.search).get("id");

//récupération des données correspondant à l'id récupéré

fetch(`http://localhost:3000/api/products/${urlId}`)
  .then((res) => res.json())
  .then((data) => {
    product = data;
    console.log(product);

    //Affichage du produit demandé et remplissage des zones html avec les données de l'api

    document.title = product.name; // donne la data "name" au titre de la page
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.alt = product.altTxt;
    document.getElementsByClassName("item__img")[0].appendChild(img);
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price + " ";
    document.getElementById("description").textContent = product.description;

    // Boucle forEach pour le choix des couleurs
    product.colors.forEach((color) => {
      const option = document.createElement("option");
      const select = document.getElementById("colors");
      option.value = color; // attribution de "color" comme valeur de <option>
      option.textContent = color;
      select.appendChild(option); // <option> devient enfant de <select>
    });
  });
