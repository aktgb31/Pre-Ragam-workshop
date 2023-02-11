const addToCartButton = document.getElementById("add-to-cart-button");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

let cart = [];
let total = 0;

addToCartButton.addEventListener("click", function () {
    cart.push({ name: "Product Name", price: 19.99 });
    total += 19.99;

    updateCart();
});

function updateCart() {
    cartItems.innerHTML = "";

    for (const item of cart) {
        const itemElement = document.createElement("li");
        itemElement.innerText = `${item.name}: $${item.price.toFixed(2)}`;
        cartItems.appendChild(itemElement);
    }

    totalPrice.innerText = `Total Price: $${total.toFixed(2)}`;
}
