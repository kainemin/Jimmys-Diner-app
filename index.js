import menuArray from './data.js';
const menu = document.getElementById('menu');
const cart = document.getElementById('cart');
const paymentModal = document.getElementById('payment-modal');
const status = document.getElementById('status');

let cartArray = [];
let freezePage = false;

document.addEventListener('click', function(e) {
    if (e.target.id) {
        if (Number.isInteger(e.target.id * 1)) {
            addToCart(e.target.id);
            renderCart()
        } else if (e.target.id === `complete-order`) {
            completeOrder();  
            document.addEventListener('click', freezePageFn, true);
        } else if (e.target.id === `pay-btn`) {
            const cardForm = document.getElementById(e.target.id).parentElement
            cardForm.addEventListener('submit', formProcessing(e));
        } else if (e.target.id === 'reload-trigger') {
            window.location.reload();
        }
    } else if (e.target.dataset.index) {
        removeCartItem(e.target.dataset.index);
    } 
})

// Render Menu
function getMenuHtml() {
    let foodHtml = ``;
    menuArray.forEach(food => {
        foodHtml += `
                    <div class="food">
                        <div class="food-emoji">
                            <span class="emoji">${food.emoji}</span>
                        </div>
                        <div class="food-details">
                            <p class="food-name">${food.name}</p>
                            <p class="food-ingredients">${food.ingredients.join(", ")}</p>
                            <p class="food-price">$${food.price}</p>
                        </div>
                        <div class="btns">
                            <i class="fa-solid fa-circle-plus" id=${food.id}></i>
                        </div>
                    </div>
                    `;
    });
    return foodHtml;
}

function renderMenu() {
    menu.innerHTML = getMenuHtml();
}

renderMenu()

// Render Cart
function addToCart(foodId) {
    const targetFood = menuArray.filter(food => food.id == foodId);
    cartArray.push(targetFood);
    cartArray = cartArray.flat();
}

function calculateTotalPrice() {
    const totalPrice = cartArray.reduce((accumulator, food) => {
        return accumulator + food.price;
      }, 0);
    return totalPrice;
}

function renderCart() {
    const cartFoods = cartArray

    let foodItems = ``;

    for (let i = 0; i < cartFoods.length; i++) {
        foodItems += `
        <div class="cart-item" id="item-${i}">
            <div class="cart-item_detail">
                <p class="food-name">${cartFoods[i].name}</p>
                <p class="remove" data-index="${[i]}">remove</p>
            </div>
            <p class="food-price">$${cartFoods[i].price}</p>
        </div>
        `;
    };

    if (foodItems !== '') {
        cart.innerHTML = `
        <div class="cart-order">
            <p>Your Order</p>
        </div>
        <div class="cart-item_list-container">
            <div class="cart-item_list">
                ${foodItems}
            </div>
            <div class="cart-item_list-price">
                <p>Total price:</p>
                <p class="food-price">$${calculateTotalPrice()}</p>
            </div>
        </div>
        <div class="cart-order_btn">
            <button type="button" id="complete-order">Complete order</button>
        </div>
        `;
    } else {
        cart.innerHTML = ``
    }
}

// Remove Cart Item

function removeCartItem(index) {
    
    const cart = cartArray;
    cart.splice(index, 1);
    renderCart()
}

// Complete order

function completeOrder() {
    let innerModal = `
    <div class="inner-modal">
        <p class="modal-title">Enter card details</p>
        <form name="cardForm" id="cardForm">
            <input type="text" name="fullName" placeholder="Your Name" required />
            <input type="number" name="cardNumber" placeholder="Card Number" required />
            <input type="number" name="CVV" placeholder="CVV" required />
            <button type="submit" value="Pay" class="pay-btn" id="pay-btn">Pay</button>
        </form>
    </div>
    `;

    paymentModal.innerHTML = innerModal;
    paymentModal.style.display = 'flex';

    freezePage = !freezePage; 
};

// Submit order

function formProcessing(e) {
    e.preventDefault();
    
    function validateForm() {
        let x = document.forms['cardForm']['fullName'].value;
        let y = document.forms['cardForm']['cardNumber'].value;
        let z = document.forms['cardForm']['CVV'].value;

        if (x == "" || y == "" || z == "") {
            alert("Please fill out the empty field(s).");
            return false;
        } else {
            return true;
        }   
    };

    if (validateForm()) {
        const cardFormData = new FormData(cardForm);
        const fullName = cardFormData.get('fullName');

        paymentModal.style.display = 'none';
        cart.style.display = 'none';

        const statusDiv = `
        <div class="order-status">  
            <p>Thanks, ${fullName}! Your order is on its way!</p>
            <p>Not enough? <span class="reload-trigger" id="reload-trigger">Order again!</span></p>
        </div>
        `
        status.innerHTML = statusDiv;

        freezePage = !freezePage;
    }
}

// Freeze Page Event on Payment Popup

function freezePageFn(e) {
    if (freezePage && e.target.id !== "pay-btn") {
        e.stopPropagation();
        e.preventDefault();
    }
};