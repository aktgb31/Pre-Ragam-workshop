const addToCartButton = document.getElementById("add-to-cart-button");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");

let cart = [];
let total = 0;

function addToCart(elem) {
    const parentNode = elem.parentNode;
    const itemId = parentNode.id.split("-")[1];
    const itemName = parentNode.getElementsByClassName("product-name")[0].innerText;
    const itemPrice = parseFloat(parentNode.getElementsByClassName("product-price")[0].innerText);
    const itemImage = parentNode.getElementsByTagName("img")[0].src;
    console.log(itemId, itemName, itemPrice, itemImage);

    const item = {
        name: itemName,
        price: itemPrice,
        image: itemImage
    }

    fetch("http://localhost:4000/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            productId: itemId
        })
    }).then(res => res.json()).then(data => {
        console.log(data);
        if (data) {
            item.id = data.id;
            cart.push(item);
            updateCart();
        } else {
            alert(data.message);
        }
    }).catch(err => {
        console.log(err);
        alert(err.message);
    });

};

function removeFromCart(id) {
    fetch(`http://localhost:4000/cart/${id}`, {
        method: "DELETE"
    }).then(res => res.json()).then(data => {
        console.log(data);
        if (data) {
            cart = cart.filter((cartItem) => {
                return cartItem.id !== id;

            })
            updateCart();
        }
        else {
            alert(data.message);
        }
    }).catch(err => {
        console.log(err);
        alert(err.message);
    });

}

function updateCart() {
    cartItems.innerHTML = "";

    total = 0;
    for (const item of cart) {
        total += item.price;
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.setAttribute("id", `cart-item-${item.id}`);
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div>${item.name}</div>
                <div>$${item.price}</div>
            </div>
            <Button class="remove-button" onclick="removeFromCart(${item.id})">Remove</Button>
        `;
        cartItems.appendChild(itemElement);
    }

    totalPrice.innerText = `Total Price: $${total.toFixed(2)}`;
}

function checkout() {
    alert("You have successfully checked out!");
    cart = [];
    updateCart();
}

async function loadProducts() {
    const products = await fetch("http://localhost:4000/products").then(res => res.json());

    console.log(products);

    const productsContainer = document.getElementById("products");
    for (const product of products) {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.id = `product-${product.id}`;
        productElement.innerHTML = `
        <h3 class="product-name">${product.name}</h3>
        <img src="${product.image}">
        <p class="product-description">${product.description}</p>
        <p>Price: $<span class="product-price">${product.cost}</span></p>
        <button class="add-to-cart-button" onclick="addToCart(this)">Add to Cart</button>
        `;
        productsContainer.appendChild(productElement);
    }
}

async function loadCart() {
    const cartItems = await fetch("http://localhost:4000/cart").then(res => res.json());

    console.log(cartItems);

    for (const item of cartItems) {
        const cartItem = {
            id: item.id,
            name: item.product.name,
            price: item.product.cost,
            image: item.product.image
        }
        cart.push(cartItem);
    }
    updateCart();
}

loadProducts().then(loadCart);