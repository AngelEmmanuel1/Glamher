let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
  document.getElementById('cart-count').innerText = cart.length;
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price)
    };
    cart.push(product);
    saveCart();
    alert(`${product.name} added to cart!`);
  });
});

// On page load
updateCartCount();

const stripe = Stripe("pk_test_51REjNLQpE9wwDNRCwwPb5iMdkFqCYjG3tm0L1lwZaAeo6M8HklNPDlimujMyitcUStbFBWwAFyr28nDM0j0aStoZ00qubgfeVc");

const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

const form = document.getElementById("payment-form");
const message = document.getElementById("payment-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Change button text to "Processing..." while payment is being processed
  const submitButton = document.getElementById("submit");
  const buttonText = document.getElementById("button-text");
  buttonText.innerText = "Processing...";
  submitButton.disabled = true;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const totalAmount = 5000; // Replace with dynamic total if needed (in cents)

  try {
    // 1. Create PaymentIntent on the backend
    const res = await fetch("http://localhost:4242/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount }) // Dynamic amount
    });

    const { clientSecret } = await res.json();

    // 2. Confirm card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: { name, email }
      }
    });

    
    if (error) {
      message.textContent = error.message;
      message.classList.remove("hidden");
      message.classList.replace("text-green-600", "text-red-600");

      buttonText.innerText = "Pay Now";
      submitButton.disabled = false;
    } else if (paymentIntent.status === "succeeded") {
      message.textContent = "✅ Payment successful!";
      message.classList.remove("hidden");

      
      emailjs.init("user_YourUserIDHere"); 

      emailjs.send("service_YourServiceIDHere", "template_YourTemplateIDHere", {
        name: name,
        email: email,
        amount: (totalAmount / 100).toFixed(2),
        cartItems: cart.map(item => `${item.name} - $${item.price.toFixed(2)}`).join(", ")
      })
      .then((response) => {
        console.log("Email sent successfully", response);
      })
      .catch((error) => {
        console.log("Error sending email", error);
      });

      // Reset button
      buttonText.innerText = "Pay Now";
      submitButton.disabled = false;
    }
  } catch (error) {
    console.error("Payment error:", error);
    message.textContent = "Payment failed. Please try again.";
    message.classList.remove("hidden");
    message.classList.replace("text-green-600", "text-red-600");

    
    buttonText.innerText = "Pay Now";
    submitButton.disabled = false;
  }

});



