import {cart, removeFromCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let cartSummaryHTML = '';
let numberOfItems = 0;
let subTotal = 0;
let shippingCost = 0;

cart.forEach((cartItem) => {
  const productId = cartItem.productId;
  numberOfItems++;
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
      subTotal += matchingProduct.priceCents;
    }
  });




  cartSummaryHTML += `
  <div class="cart-item-container
    js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary">
            Update
          </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options js-delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option js-free-delivery-option">
          <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}" value="free">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option js-499-delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}" value="standard">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option js-999-delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}" value="express">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
});



document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      let productPriceCents;
      products.forEach((product) => {
          if (product.id === productId) {
            productPriceCents = product.priceCents;
          }
        });
      subTotal -= productPriceCents; // Subtract the price of the product from subTotal
      updateOrderSummary();
      removeFromCart(productId);
      numberOfItems--;
      updateItemCount();

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
    });
  });

    updateItemCount();
    updateOrderSummary();

  function updateItemCount(){
    document.querySelector('.js-number-items').innerHTML = `${numberOfItems} items`;
    document.querySelector('.js-number-items-oder-summary').innerHTML = `Items (${numberOfItems}): `;
  }

 function updateOrderSummary(){
  subTotal = subTotal;
  document.querySelector('.js-payment-summary-money').innerHTML = `$${formatCurrency(subTotal)}`;

  document.querySelector('.js-shipping-handling-cost').innerHTML = `$${formatCurrency(shippingCost)}`;

  let shippingPlusTotal = subTotal + shippingCost;
  document.querySelector('.js-payment-summary-money1').innerHTML = `$${formatCurrency(shippingPlusTotal)}`;

  let tax = shippingPlusTotal/10;
  document.querySelector('.js-payment-summary-money-tax').innerHTML = `$${formatCurrency(tax)}`;

  let finalTotal = tax + shippingPlusTotal;
  document.querySelector('.js-payment-summary-money-total').innerHTML = `$${formatCurrency(finalTotal)}`;
 }




  // radio buttons
  if (numberOfItems !== 1){
  const radioButtons = document.querySelectorAll('.delivery-option-input');
  
  radioButtons.forEach((radio) => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const value = this.value;
        if (value === 'free') {
          shippingCost = 0;
        } else if (value === 'standard') {
          shippingCost = 499;
        } else if (value === 'express') {
          shippingCost = 999;
        }
        updateOrderSummary();
      }
    });
  });
  }



  