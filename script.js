document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsDiv = document.getElementById('cart-items');
    const totalAmountSpan = document.getElementById('total-amount');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add to cart function
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productId = productCard.getAttribute('data-id');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('p').textContent.replace('$', ''));

            const existingProduct = cart.find(item => item.id === productId);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
        });
    });

    // Update cart page
    function updateCartPage() {
        if (!cartItemsDiv) return;

        cartItemsDiv.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <p>${item.name} x${item.quantity}</p>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove" data-id="${item.id}">Remove</button>
            `;
            cartItemsDiv.appendChild(cartItemDiv);

            total += item.price * item.quantity;
        });

        totalAmountSpan.textContent = total.toFixed(2);

        // Remove product from cart
        document.querySelectorAll('.remove').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-id');
                cart = cart.filter(item => item.id !== productId);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartPage();
            });
        });
    }

    // Initialize cart page if on cart.html
    if (document.body.classList.contains('cart')) {
        updateCartPage();
    }
});
