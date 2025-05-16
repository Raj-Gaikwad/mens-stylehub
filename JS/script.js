// ✅ Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

// ✅ Mobile number validation
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            const mobile = document.getElementById('mobile').value;
            const code = document.getElementById('countryCode').value;

            if (!/^\d{10}$/.test(mobile)) {
                alert("Please enter a valid 10-digit mobile number.");
                e.preventDefault();
            } else {
                const fullMobile = `${code}${mobile}`;
                console.log("User mobile:", fullMobile);
            }
        });
    }

    // Only render products if product section exists
    if (document.getElementById("product-list")) {
        filterProducts("all");
    }

    // Only render cart if cart table exists
    if (document.getElementById("cart-items")) {
        renderCart();
    }
});


// ✅ Product Data
const productData = {
    shirts: [
        {
            name: "Allen Solly Classic Stripe Shirt",
            price: "₹499",
            img: "./Images/Shirts/Allen-Solly-Men.jpg"
        },
        {
            name: "DEELMO Solid Satin Shirt",
            price: "₹459",
            img: "./Images/Shirts/DEELMO-Men.jpg"
        },
        {
            name: "Dennis Lingo Checkered Shirt",
            price: "₹699",
            img: "./Images/Shirts/Dennis-Lingo-Men.jpg"
        }
    ],
    tshirts: [
        {
            name: "BULLMER Oversized Tee",
            price: "₹299",
            img: "./Images/T-shirts/BULLMER-Trendy.jpg"
        },
        {
            name: "LEOTUDE Cottonblend Tee",
            price: "₹349",
            img: "./Images/T-shirts/LEOTUDE-Men.jpg"
        },
        {
            name: "Veirdo Baggy Printed Tee",
            price: "₹199",
            img: "./Images/T-shirts/Veirdo-Oversized-Baggy.jpg"
        }
    ],
    jeans: [
        {
            name: "JVX Cargo Jeans",
            price: "₹799",
            img: "./Images/Jeans/JVX-Men-Jeans.jpg"
        },
        {
            name: "Thomas Scott Light Fade Jeans",
            price: "₹599",
            img: "./Images/Jeans/Thomas-Scott-Men.jpg"
        },
        {
            name: "TAGAS Relaxed Denim",
            price: "₹1299",
            img: "./Images/Jeans/TAGAS-Men-Relaxed-FIT-Denim-Jeans.jpg"
        }
    ]
};


// ✅ Filter & Load Products into DOM
function filterProducts(category) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    productList.innerHTML = "";

    const selectedProducts = category === "all"
        ? [...productData.shirts, ...productData.tshirts, ...productData.jeans]
        : productData[category] || [];

    selectedProducts.forEach(product => {
        const card = `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${product.img}" class="card-img-top" alt="${product.name}">
          <div class="card-body text-center">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price}</p>
            <button class="btn btn-primary" onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
          </div>
        </div>
      </div>
      `;
        productList.insertAdjacentHTML("beforeend", card);
    });
}


// ✅ Add to Cart Function
function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    cartCount++;
    localStorage.setItem("cart", JSON.stringify(cart));
    showToast(`${product.name} added to cart!`);
}


function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  toast.innerText = message;

  document.body.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}



// ✅ Render Cart on Cart Page
function renderCart() {
    const tbody = document.getElementById("cart-items");
    const totalDisplay = document.getElementById("cart-total");
    tbody.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = parseFloat(item.price.replace("₹", "")) * item.qty;
        total += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${item.img}" class="img-fluid product-img" alt="${item.name}"></td>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${index}, -1)">-</button>
            <span class="mx-2">${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="changeQty(${index}, 1)">+</button>
          </td>
          <td>₹${subtotal.toFixed(2)}</td>
          <td><button class="btn btn-sm btn-danger" onclick="removeItem(${index})">Remove</button></td>
        `;
        tbody.appendChild(row);
    });

    totalDisplay.textContent = `₹${total.toFixed(2)}`;
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ✅ Cart Actions
function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

function clearCart() {
    cart = [];
    renderCart();
}




// Prefill total from cart
document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace("₹", ""));
        total += price * item.qty;
    });

    document.getElementById("total-amount").value = `₹${total.toFixed(2)}`;
});

// Handle form submission
document.getElementById("checkout-form").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("🎉 Order placed successfully!");
    localStorage.removeItem("cart"); // clear cart after checkout
    window.location.href = "index.html"; // redirect to home or thank you
});
