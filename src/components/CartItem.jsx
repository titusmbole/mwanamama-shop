// src/components/CartItem.js
import React, { useState } from 'react';
import { Plus, Minus, Trash2, Heart } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove, onMoveToWishlist }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  // Safe value extraction with defaults
  const itemPrice = parseFloat(item?.price || 0);
  const itemQuantity = parseInt(item?.quantity || 1);
  const itemName = item?.name || 'Product';
  const itemImage = item?.image || '/api/placeholder/300/200';
  const itemDescription = item?.description || 'No description available';
  const itemOriginalPrice = item?.originalPrice ? parseFloat(item.originalPrice) : null;

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };
 
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const subtotal = itemPrice * itemQuantity;

  // If item is invalid, don't render
  if (!item || !item.id) {
    return null;
  }

  return (
    <div 
      className={`card mb-3 border-0 shadow-sm ${isRemoving ? 'opacity-50' : ''}`}
      style={{
        transition: 'all 0.3s ease',
        transform: isRemoving ? 'scale(0.95)' : 'scale(1)'
      }}
    >
      <div className="row g-0">
        <div className="col-md-2">
          <img
            src={itemImage}
            className="img-fluid w-100 h-100"
            alt={itemName}
            style={{ height: '150px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/api/placeholder/300/200';
            }}
          />
        </div>

        <div className="col-md-5">
          <div className="card-body h-100 d-flex flex-column">
            <h6 className="card-title fw-bold mb-2" style={{color: '#2c3e50'}}>
              {itemName}
            </h6>
            
            <p 
              className="card-text text-muted small mb-2"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {itemDescription}
            </p>
            
            <div className="mb-2">
              {item.size && (
                <span className="badge bg-light text-dark me-2">Size: {item.size}</span>
              )}
              {item.color && (
                <span className="badge bg-light text-dark">Color: {item.color}</span>
              )}
            </div>

            <div className="mb-2">
              <div className="mb-1">
                <small className="text-muted">Unit Price:</small>
              </div>
              <span className="fw-bold" style={{color: '#667eea'}}>
                KSh {itemPrice.toLocaleString()}
              </span>
              {itemOriginalPrice && itemOriginalPrice > itemPrice && (
                <>
                  <span className="text-muted text-decoration-line-through small ms-2">
                    KSh {itemOriginalPrice.toLocaleString()}
                  </span>
                  <span className="badge bg-success ms-2 small">
                    {Math.round(((itemOriginalPrice - itemPrice) / itemOriginalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="d-flex gap-2 mt-auto">
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={handleRemove}
                disabled={isRemoving}
              >
                <Trash2 size={14} className="me-1" />
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => onMoveToWishlist && onMoveToWishlist(item)}
              >
                <Heart size={14} className="me-1" />
                Save for later
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card-body h-100 d-flex flex-column justify-content-center">
            <label className="form-label small text-muted mb-2">Quantity</label>
            <div className="d-flex align-items-center mb-3">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(itemQuantity - 1)}
                disabled={itemQuantity <= 1}
                style={{width: '35px', height: '35px'}}
              >
                <Minus size={14} />
              </button>
              <span className="mx-3 fw-bold fs-5">{itemQuantity}</span>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => handleQuantityChange(itemQuantity + 1)}
                style={{width: '35px', height: '35px'}}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <div className="card-body h-100 d-flex flex-column justify-content-center text-end">
            <label className="form-label small text-muted mb-2">Subtotal</label>
            <h5 className="fw-bold mb-0" style={{color: '#667eea'}}>
              KSh {subtotal.toLocaleString()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;