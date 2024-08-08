document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.buy-button');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favourites = JSON.parse(localStorage.getItem('favourites')) || [];

    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const item = cart.find(item => item.name === name);
            
            if (item) {
                item.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${name} added to cart`);
        });
    });

    if (document.getElementById('order-summary-body')) {
        const orderSummaryBody = document.getElementById('order-summary-body');
        const totalPriceElement = document.getElementById('total-price');
        const checkoutButton = document.getElementById('checkout-button');
        const addFavouritesButton = document.getElementById('add-favourites-button');
        const applyFavouritesButton = document.getElementById('apply-favourites-button');
        let total = 0;

        const updateCartDisplay = () => {
            orderSummaryBody.innerHTML = '';
            total = 0;
            cart.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>Rs. ${item.price}</td>
                    <td>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
                    </td>
                    <td>Rs. ${item.price * item.quantity}</td>
                    <td><button data-index="${index}" class="remove-button">Remove</button></td>
                `;
                orderSummaryBody.appendChild(row);
                total += item.price * item.quantity;
            });
            totalPriceElement.textContent = total;
        };

        const updateFavouritesDisplay = () => {
            orderSummaryBody.innerHTML = '';
            total = 0;
            favourites.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>Rs. ${item.price}</td>
                    <td>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input">
                    </td>
                    <td>Rs. ${item.price * item.quantity}</td>
                    <td><button data-index="${index}" class="remove-button">Remove</button></td>
                `;
                orderSummaryBody.appendChild(row); 
                total += item.price * item.quantity;
            });
            totalPriceElement.textContent = total;
        };

        orderSummaryBody.addEventListener('input', (event) => {
            if (event.target.classList.contains('quantity-input')) {
                const index = event.target.getAttribute('data-index');
                const newQuantity = parseInt(event.target.value);
                if (newQuantity > 0) {
                    cart[index].quantity = newQuantity;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                }
            }
        });

        orderSummaryBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-button')) {
                const index = event.target.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            }
        });

        updateCartDisplay();

        checkoutButton.addEventListener('click', () => {
            localStorage.setItem('checkoutCart', JSON.stringify(cart));
            window.location.href = 'checkoutpage.html';
        });

        addFavouritesButton.addEventListener('click', () => {
            localStorage.setItem('favourites', JSON.stringify(cart));
            alert('Cart saved to favourites');
        });

        applyFavouritesButton.addEventListener('click', () => {
            cart = JSON.parse(localStorage.getItem('favourites')) || [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateFavouritesDisplay();
            alert('Favourites applied');
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            localStorage.removeItem('cart');
            alert('Order placed successfully!');
            window.location.href = 'index.html';
        });
    }

    const checkoutSummaryBody = document.getElementById('checkout-summary-body');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');

    if (checkoutSummaryBody) {
        let checkoutCart = JSON.parse(localStorage.getItem('checkoutCart')) || [];
        let total = 0;

        checkoutCart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>Rs. ${item.price}</td>
                <td>${item.quantity}</td>
                <td>Rs. ${item.price * item.quantity}</td>
            `;
            checkoutSummaryBody.appendChild(row);
            total += item.price * item.quantity;
        });

        checkoutTotalPrice.textContent = total;
    }
});
