"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const cartEl = document.querySelector(".cart-items");
  const dataProducts = JSON.parse(products);
  const productsLocalStorageKey = "cart-products";
  let cartProducts =
    JSON.parse(localStorage.getItem(productsLocalStorageKey)) || [];

  function renderCards(productsArray) {
    productsArray.forEach((value, index, array) => {
      let card = document.createElement("div");
      card.classList.add("product-card");
      const product = productsArray[index];
      const currency = product.currency;

      const pricePrefix = currency === "USD" ? "$" : "";
      const pricePostfix = currency === "USD" ? "" : "₽";

      const price = product.price.toFixed(2);

      const productCard = `
      <div class="image-wrap">
        <img src="${product.image}">
        <button class="btn" data-product-id="${product.id}" >
          <img class="btn__icon" src="img/cart.svg">
          <span class="btn__text">
            Add to Cart
          </span>
        </button>
      </div>
      <div class="title">${product.title}</div>
      <p class="descr">${product.text}</p>
      <div class="currency">
        ${pricePrefix}${price} ${pricePostfix}
      </div>
    `;

      card.innerHTML = productCard;
      document.querySelector(".products").appendChild(card);
    });
  }
  renderCards(dataProducts);

  const addCardBtn = document.querySelectorAll(".btn");
  addCardBtn.forEach((btn) =>
    btn.addEventListener("click", (event) => {
      addToCart(event);
    })
  );

  const addToCart = (event) => {
    const productId = event.currentTarget.getAttribute("data-product-id");
    const product = dataProducts.find(
      (product) => product.id === parseInt(productId, 10)
    );

    const findCardProductsItem = cartProducts.find(
      (item) => item.id === product.id
    );
    if (findCardProductsItem) {
      const newCardProducts = cartProducts.map((item) => {
        if (item.id === product.id) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
      product.count += 1;
      localStorage.setItem(
        productsLocalStorageKey,
        JSON.stringify(newCardProducts)
      );
    } else {
      product.count = 1;
      cartProducts.push(product);
      renderCartCard(product);
      localStorage.setItem(
        productsLocalStorageKey,
        JSON.stringify(cartProducts)
      );
    }
  };

  //================================================

  const localStorageProducts = localStorage.getItem(productsLocalStorageKey);
  const productsJson = JSON.parse(localStorageProducts);

  function renderCartCard(product) {
    const currency = product.currency;

    const pricePrefix = currency === "USD" ? "$" : "";
    const pricePostfix = currency === "USD" ? "" : "₽";

    const price = product.price.toFixed(2);

    const productCardCart = document.createElement("div");
    productCardCart.innerHTML = `
        <div class="image-wrap-cart">
            <img class="image-cart" src="${product.image}" >
            <button class="btn-cart" data-product-id="${product.id}" >
              <img class="btn__icon-cart" src="img/cros.png">
            </button>
            <div class="title">${product.title}</div>
            <p class="descr">${product.text}</p>
            <div class="currency">
            ${pricePrefix}${price} ${pricePostfix}
            </div>
          </div>
    `;
    cartEl.appendChild(productCardCart);
    const cardBtn = productCardCart.firstElementChild.children[1];
    cardBtn.addEventListener("click", () => {
      const id = cardBtn.getAttribute("data-product-id");
      deleteProduct(id);
    });
  }

  function renderCartProductCard(payload) {
    for (const key in payload) {
      renderCartCard(payload[key]);
    }
  }

  renderCartProductCard(productsJson);

  function deleteProduct(id) {
    const filtredProductCards = cartProducts.filter((item) => item.id !== id);
    localStorage.setItem(
      productsLocalStorageKey,
      JSON.stringify(filtredProductCards)
    );

    document.querySelector(".image-wrap-cart").remove();
  }
});
