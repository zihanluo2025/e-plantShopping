import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from './CartSlice';
import './CartItem.css';

const CartItem = ({ onContinueShopping }) => {
  const cart = useSelector(state => state.cart.items);
  const dispatch = useDispatch();

  const toNumberCost = (rawCost) => {
    if (typeof rawCost === 'number') return rawCost;
    if (rawCost == null) return 0;
    const n = Number(String(rawCost).replace(/[^0-9.]/g, '')); // "$10.00" -> 10
    return Number.isFinite(n) ? n : 0;
  };

  const calculateTotalAmount = () => {
    if (!Array.isArray(cart) || cart.length === 0) return '0.00';

    const totalCents = cart.reduce((sum, item) => {
      const qty = Number(item?.quantity ?? 0) || 0;
      const cost = toNumberCost(item?.cost);
      return sum + Math.round(cost * 100) * qty;
    }, 0);

    return (totalCents / 100).toFixed(2);
  };

  const handleContinueShopping = (e) => {
    e.preventDefault();
    if (typeof onContinueShopping === 'function') onContinueShopping(e);
  };

  const handleIncrement = (item) => {
    const nextQty = (Number(item?.quantity ?? 0) || 0) + 1;
    dispatch(updateQuantity({ name: item.name, quantity: nextQty }));
  };

  const handleDecrement = (item) => {
    const currentQty = Number(item?.quantity ?? 0) || 0;
    const nextQty = currentQty - 1;

    if (nextQty <= 0) {
      dispatch(removeItem(item.name)); // ✅ payload is name string
      return;
    }
    dispatch(updateQuantity({ name: item.name, quantity: nextQty }));
  };

  const handleRemove = (item) => {
    dispatch(removeItem(item.name)); // ✅ payload is name string
  };

  const calculateTotalCost = (item) => {
    const qty = Number(item?.quantity ?? 0) || 0;
    const cost = toNumberCost(item?.cost);
    const cents = Math.round(cost * 100) * qty;
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="cart-container">
      <h2 style={{ color: 'black' }}>Total Cart Amount: ${calculateTotalAmount()}</h2>

      <div>
        {cart.map(item => (
          <div className="cart-item" key={item.name}>
            <img className="cart-item-image" src={item.image} alt={item.name} />
            <div className="cart-item-details">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-cost">{item.cost}</div>

              <div className="cart-item-quantity">
                <button
                  className="cart-item-button cart-item-button-dec"
                  onClick={() => handleDecrement(item)}
                >
                  -
                </button>
                <span className="cart-item-quantity-value">{item.quantity}</span>
                <button
                  className="cart-item-button cart-item-button-inc"
                  onClick={() => handleIncrement(item)}
                >
                  +
                </button>
              </div>

              <div className="cart-item-total">Total: ${calculateTotalCost(item)}</div>
              <button className="cart-item-delete" onClick={() => handleRemove(item)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="continue_shopping_btn">
        <button className="get-started-button" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
        <br />
        <button
          className="get-started-button1"
          onClick={(e) => {
            e.preventDefault();
            alert('Functionality to be added for future reference');
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartItem;
