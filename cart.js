document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-container");
    const summary = document.getElementById("cart-summary");
    const totalEl = document.getElementById("cart-total");
    const emptyMsg = document.getElementById("empty-message");
  
    function renderCart() {
      container.innerHTML = "";
      if (cart.length === 0) {
        emptyMsg.style.display = "block";
        summary.style.display = "none";
        return;
      }
  
      emptyMsg.style.display = "none";
      summary.style.display = "block";
  
      let total = 0;
  
      cart.forEach((item, index) => {
        total += item.price;
  
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded shadow flex justify-between items-center";
  
        card.innerHTML = `
          <div>
            <h4 class="font-semibold">${item.name}</h4>
            <p class="text-pink-600">$${item.price.toFixed(2)}</p>
          </div>
          <button class="remove-item bg-red-500 text-white px-4 py-2 rounded" data-index="${index}">Remove</button>
        `;
  
        container.appendChild(card);
      });
  
      totalEl.innerText = total.toFixed(2);
  
      // Attach remove event
      document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", () => {
          const index = parseInt(button.dataset.index);
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        });
      });
    }
  
    renderCart();
  });
  