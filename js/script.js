function getProducts() {
  fetch("http://localhost:3000/api/products")
    .then(function (data) {
      let products = data;
      console.log(data);
    })

    .catch(function (error) {
      console.log("Quelque chose ne s'est pas bien passé");
    });
}

getProducts();
