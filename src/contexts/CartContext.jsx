import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlistItems');
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (error) {
      console.error("Failed to parse wishlist items from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.id === product.id);
      if (exists) {
        // Product already exists in the cart, do not add it again,
        // just update its quantity.
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      }

      // Calculate final price based on discount and originalPrice
      let finalPrice = product.price;
      if (product.discount && product.discount > 0 && product.originalPrice) {
        finalPrice = product.originalPrice * (1 - product.discount / 100);
      } else if (product.originalPrice) {
        finalPrice = product.originalPrice;
      }

      // Create a new cart item with all necessary data
      const cartItem = {
        ...product, // Spread all product properties
        price: finalPrice,
        quantity: product.quantity || 1 // Use existing quantity or default to 1
      };

      // Add the new item to the cart
      return [...prevItems, cartItem];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleWishlist = (product) => {
    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => item.id === product.id);
      if (exists) {
        return prevItems.filter(item => item.id !== product.id);
      }
      return [...prevItems, product];
    });
  };

  const clearCart = () => setCartItems([]);
  const clearWishlist = () => setWishlistItems([]);

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    toggleWishlist,
    clearCart,
    clearWishlist,
    cartCount: cartItems.length,
    wishlistCount: wishlistItems.length,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};