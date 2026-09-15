import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState(() => {
		const saved = localStorage.getItem('cartItems');
		return saved ? JSON.parse(saved) : [];
	});

	const updateItems = (nextItems) => {
		setItems(nextItems);
		localStorage.setItem('cartItems', JSON.stringify(nextItems));
	};

	const addItem = (product) => {
		const existing = items.find(item => item.productId === product.productId);
		updateItems(existing
			? items.map(item => item.productId === product.productId ? { ...item, quantity: item.quantity + 1 } : item)
			: [...items, { ...product, quantity: 1 }]);
	};

	const removeItem = (productId) => updateItems(items.filter(item => item.productId !== productId));
	const clearCart = () => updateItems([]);
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
