import React from 'react';

const ProductModal = ({ show, handleClose, product }) => {
  const showHideClassName = show ? "modal d-block" : "modal d-none";

  if (!product) {
    return null;
  }

  return (
    <div className={showHideClassName} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title">{product.name}</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body text-center">
            <img src={product.image} className="img-fluid rounded" alt={product.name} style={{ maxHeight: '70vh', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;