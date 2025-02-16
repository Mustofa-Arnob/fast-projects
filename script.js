
// script.js
document.addEventListener("DOMContentLoaded", () => {
    const apiUrls = [
        "https://fakestoreapi.com/products",
        "https://api.escuelajs.co/api/v1/products"
    ];

    const productList = document.getElementById("product-list");
    const cartItems = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const vatElement = document.getElementById("vat");
    const deliveryChargeElement = document.getElementById("delivery-charge");
    const checkoutPriceElement = document.getElementById("checkout-price");
    const checkoutButton = document.getElementById("checkout");
    const clearCartButton = document.getElementById("clear-cart");
    let cart = [];
    let products = [];
    const VAT_RATE = 0.10;
    const SHIPPING_COST = 5.00;

    const fetchProducts = async () => {
        try {
            for (const url of apiUrls) {
                const response = await fetch(url);
                const data = await response.json();
                products = products.concat(data);
            }
            displayProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const displayProducts = (products) => {
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "col-md-4 mb-4";
            productCard.innerHTML = `
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">$${product.price}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });

        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", () => {
                const productId = parseInt(button.getAttribute("data-id"));
                addToCart(productId);
            });
        });
    };

    const addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const cartItem = cart.find(item => item.product.id === productId);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ product, quantity: 1 });
            }
            updateCart();
        } else {
            console.error(`Product with ID: ${productId} not found`);
        }
    };

    const updateCart = () => {
        cartItems.innerHTML = "";
        let totalPrice = 0;
        cart.forEach(item => {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.className = "cart-item mb-2";
            cartItemDiv.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <img src="${item.product.image}" alt="${item.product.title}" class="img-thumbnail" style="width: 50px;">
                    <p>${item.product.title}</p>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-sm quantity-decrease" data-id="${item.product.id}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-outline-secondary btn-sm quantity-increase" data-id="${item.product.id}">+</button>
                    </div>
                    <p>$${(item.product.price * item.quantity).toFixed(2)}</p>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.product.id}">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItemDiv);
            totalPrice += item.product.price * item.quantity;
        });

        const vat = totalPrice * VAT_RATE;
        const deliveryCharge = cart.length > 0 ? SHIPPING_COST : 0;
        const checkoutPrice = totalPrice + vat + deliveryCharge;

        totalPriceElement.textContent = `Total Price (Excl. VAT & Shipping): $${totalPrice.toFixed(2)}`;
        vatElement.textContent = `VAT (10%): $${vat.toFixed(2)}`;
        deliveryChargeElement.textContent = `Delivery Charge: $${deliveryCharge.toFixed(2)}`;
        checkoutPriceElement.textContent = `Checkout Price (Incl. VAT & Shipping): $${checkoutPrice.toFixed(2)}`;
        checkoutButton.disabled = cart.length === 0;

        document.querySelectorAll(".quantity-decrease").forEach(button => {
            button.addEventListener("click", () => {
                const productId = parseInt(button.getAttribute("data-id"));
                const cartItem = cart.find(item => item.product.id === productId);
                if (cartItem && cartItem.quantity > 1) {
                    cartItem.quantity--;
                    updateCart();
                } else if (cartItem && cartItem.quantity === 1) {
                    cart = cart.filter(cartItem => cartItem.product.id !== productId);
                    updateCart();
                }
            });
        });

        document.querySelectorAll(".quantity-increase").forEach(button => {
            button.addEventListener("click", () => {
                const productId = parseInt(button.getAttribute("data-id"));
                const cartItem = cart.find(item => item.product.id === productId);
                if (cartItem) {
                    cartItem.quantity++;
                    updateCart();
                }
            });
        });

        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", () => {
                const productId = parseInt(button.getAttribute("data-id"));
                cart = cart.filter(cartItem => cartItem.product.id !== productId);
                updateCart();
            });
        });
    };

    clearCartButton.addEventListener("click", () => {
        cart = [];
        updateCart();
    });

    checkoutButton.addEventListener("click", () => {
        alert("Checkout not implemented yet.");
    });

    fetchProducts();
});
