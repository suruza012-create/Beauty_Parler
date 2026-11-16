import React, { createContext, useCallback, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
	const [items, setItems] = useState(() => {
		const saved = localStorage.getItem('cartItems');
		try {
			return saved ? JSON.parse(saved) : [];
		} catch {
			localStorage.removeItem('cartItems');
			return [];
		}
	});

	const updateItems = (nextItems) => {
		const resolvedItems = typeof nextItems === 'function' ? nextItems(items) : nextItems;
		setItems(resolvedItems);
		localStorage.setItem('cartItems', JSON.stringify(resolvedItems));
	};

	const addItem = (product) => {
		updateItems((currentItems) => {
			const existing = currentItems.find(item => item.productId === product.productId);
			if (existing) {
				return currentItems.map(item => item.productId === product.productId
					? { ...item, quantity: item.quantity + 1 }
					: item
				);
			}
			return [...currentItems, { ...product, quantity: 1 }];
		});
	};

	const removeItem = (productId) => updateItems((currentItems) => currentItems.filter(item => item.productId !== productId));
	const clearCart = useCallback(() => {
		setItems([]);
		localStorage.setItem('cartItems', '[]');
	}, []);
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
