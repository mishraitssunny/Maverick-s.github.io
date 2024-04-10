

// Function to update the total amount in the shopping cart
function updateTotal() {
    let total = 0;
    // Get all the item boxes in the shopping cart
    let cartItems = document.querySelectorAll('.shopping-cart .box');
    // Loop through each item box and calculate the total amount
    cartItems.forEach(item => {
        // Get the price of each item
        let priceString = item.querySelector('.price').innerText;
        let priceMatch = priceString.match(/(\d+(\.\d+)?)/); // Match numerical values
        if (priceMatch) {
            let price = parseFloat(priceMatch[0]); // Extract the matched price value
            // Add the price of the item to the total
            total += price;
        }
    });
    // Update the total amount in the shopping cart
    document.querySelector('.shopping-cart .total').innerText = `Total: ₹${total.toFixed(2)}/-`;
}

// Retrieve cart data from localStorage on page load
document.addEventListener('DOMContentLoaded', function () {
    let savedCart = JSON.parse(localStorage.getItem('cart'));
    if (savedCart) {
        // Populate the cart with the saved cart data
        savedCart.forEach(item => {
            addToCart(item); // Add each item to the cart
        });
    }
    // Update total amount
    updateTotal();
});

// Function to add item to cart
function addToCart(item) {
    // Create HTML structure for the item
    let newItem = document.createElement('div');
    newItem.classList.add('box');
    newItem.innerHTML = `
        <i class="fas fa-trash"></i>
        <img src="${item.imgSrc}" alt="">
        <div class="content">
            <h3>${item.name}</h3>
            <span class="price">${item.price}</span>
            <span class="quantity">qty : 1</span>
        </div>
    `;
    // Get the shopping cart container
    let shoppingCart = document.querySelector('.shopping-cart');
    // Insert the new item into the shopping cart
    shoppingCart.insertBefore(newItem, shoppingCart.querySelector('.total'));
}

// Event listener for "add to cart" buttons
const addToCartButtons = document.querySelectorAll('.products .btn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default behavior of <a> tag
        // Get product details
        let box = event.target.closest('.box');
        let productPrice = box.querySelector('.price').innerText;
        let productName = box.querySelector('h3').innerText;
        let productImgSrc = box.querySelector('img').src;
        // Save item to localStorage
        let newItem = { name: productName, price: productPrice, imgSrc: productImgSrc };
        let savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        savedCart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(savedCart));
        // Add item to cart UI
        addToCart(newItem);
        // Update total amount
        updateTotal();
    });
});

// Event delegation for delete buttons
document.querySelector('.shopping-cart').addEventListener('click', function(event) {
    if (event.target.classList.contains('fa-trash')) {
        // Get the parent box element of the clicked delete button
        let box = event.target.closest('.box');
        // Remove the box element from the DOM
        box.remove();
        // Update total after deletion
        updateTotal();
        // Retrieve cart data from localStorage
        let savedCart = JSON.parse(localStorage.getItem('cart'));
        // Find index of item to remove from savedCart
        let indexToRemove = savedCart.findIndex(item => item.name === box.querySelector('h3').innerText);
        // Remove item from savedCart
        savedCart.splice(indexToRemove, 1);
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(savedCart));
    }
});

// Function to initialize the total amount on page load
window.onload = function() {
    updateTotal();
};





function submitToWeb3Forms(event) {
    event.preventDefault(); // Prevent the default form submission
    const form = document.getElementById('login-form');
    const email = form.querySelector('#email').value;
    const yourName = form.querySelector('#yourName').value;
    const phone = form.querySelector('#phone').value;
    const housenumber = form.querySelector('#housenumber').value;
    const city = form.querySelector('#city').value;
    const landmark = form.querySelector('#landmark').value;
    const pincode = form.querySelector('#pincode').value;

    // Validate form fields
    if (!email || !yourName || !phone || !housenumber || !city || !landmark || !pincode) {
        alert('Please fill in all the required fields.');
        return; // Exit the function if any field is empty
    }

    // Retrieve total price from the webpage
    let totalPriceString = document.querySelector('.shopping-cart .total').innerText;
    let totalPriceMatch = totalPriceString.match(/(\d+(\.\d+)?)/); // Match numerical values
    let totalPrice = 0;
    if (totalPriceMatch) {
        totalPrice = parseFloat(totalPriceMatch[0]); // Extract the total price value
    }


    // Check if the cart is empty
    let savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length === 0) {
            alert('Your cart is empty. Please add items to your cart before placing an order.');
            return; // Exit the function if the cart is empty
    }


    
   // Retrieve cart items from localStorage
    let cartItems = '';
    savedCart.forEach(item => {
        cartItems += `${item.name} - ${item.price}\n`;
    });

    // Construct the form data to send to Web3Forms API
    const formData = new FormData();
    formData.append('access_key', 'b04ec2a7-7330-465b-8833-cafc66aad9de');
    formData.append('name', ''); // You can leave this empty
    formData.append('email', email);
    formData.append('message', `\nAddress Details:\n\nYour Name: ${yourName}\nPhone Number: ${phone}\nHouse Number: ${housenumber}\nCity: ${city}\nLandmark: ${landmark}\nPincode: ${pincode}\n\nCart Items:\n${cartItems}\nTotal Price: ₹${totalPrice.toFixed(2)}`); // Assuming the currency is in Rupees

    // Send the form data to Web3Forms API using Fetch API
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            // Display full screen message
            document.getElementById('overlay').style.display = 'block';
            form.reset(); // Reset the form fields after successful submission
            localStorage.removeItem('cart'); // Clear cart data after submission
        } else {
            alert('Form submission failed. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Form submission failed. Please try again later.');
    });
}


document.getElementById("checkout-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default behavior (redirect)
    document.getElementById("login-btn").click();
});



document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('openAddressForm')) {
        document.getElementById('login-btn').click(); // Open address form
        localStorage.removeItem('openAddressForm'); // Remove the flag
    }
});


// JavaScript code to show/hide loading overlay
window.addEventListener("load", function() {
    // Show loading overlay
    var loadingOverlay = document.querySelector('.loading-overlay');
    loadingOverlay.style.display = 'flex'; // Show the loading overlay

    // Set a timeout to hide the loading overlay after 3 seconds
    setTimeout(function() {
        loadingOverlay.style.display = 'none'; // Hide the loading overlay
    }, 3000); // 3000 milliseconds = 3 seconds
});



















// Existing JavaScript code
let searchForm = document.querySelector('.search-form');
let productSection = document.getElementById('products'); // Reference to the products section
document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
};
// Function to handle search
function handleSearch(event) {
    event.preventDefault();
    let searchInput = document.getElementById('search-box').value.toLowerCase(); // Convert search query to lowercase for case-insensitive search

    // Get all items to search through
    let itemsToSearch = document.querySelectorAll('.products .box h3 , .menu .box h3');

    let foundItem = false;

    // Loop through each item and check if it matches the search query
    itemsToSearch.forEach(item => {
        let itemName = item.innerText.toLowerCase(); // Convert item name to lowercase
        let index = itemName.indexOf(searchInput); // Find the index of the search query in the item name
        if (index !== -1) {
            foundItem = true;
            // Scroll to the products section
            productSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Highlight the matching character(s) in the item name
            let highlightedText = itemName.substring(0, index) + "<span style='background-color: yellow'>" + itemName.substring(index, index + searchInput.length) + "</span>" + itemName.substring(index + searchInput.length);
            item.innerHTML = highlightedText;
        }
    });

    // If no item is found, you can display a message or take any other desired action
    if (!foundItem) {
        alert('Item not found');
    }
}

// Event listener for search form submission
searchForm.addEventListener('submit', handleSearch);

let shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#crt-btn').onclick = () => {
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
};

let loginForm = document.querySelector('.login-form');
document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
};

let navbar = document.querySelector('.navbar');
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
};
window.onscroll = () => {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
};

var swiper = new Swiper(".product-slider", {
    loop: true,
    spaceBetween: 20,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    centeredSlides: true,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1020: {
            slidesPerView: 3,
        },
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    keyboard: {
        enabled: true,
        onlyInViewport: false,
    },
});

// Manually control slide movement with navigation buttons
document.querySelector('.swiper-button-next').addEventListener('click', function() {
    swiper.slideNext();
});

document.querySelector('.swiper-button-prev').addEventListener('click', function() {
    swiper.slidePrev();
});



