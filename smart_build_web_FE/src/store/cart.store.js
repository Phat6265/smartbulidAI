// Cart Store - Zustand
import { create } from 'zustand';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem('smartbuild_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('smartbuild_cart', JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const useCartStore = create((set, get) => ({
  items: loadCartFromStorage(), // [{ materialId, name, price, quantity, image }]

  // Add item to cart
  addItem: (material) => {
    const items = get().items;
    const existingItem = items.find(item => item.materialId === material._id || item.materialId === material.id);

    let newItems;
    if (existingItem) {
      // Update quantity if item already exists
      newItems = items.map(item =>
        (item.materialId === material._id || item.materialId === material.id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Add new item
      newItems = [
        ...items,
        {
          materialId: material._id || material.id,
          name: material.name,
          price: material.priceReference,
          quantity: 1,
          image: material.images?.[0] || null,
          category: material.category || null,
          subcategory: material.subcategory || null
        }
      ];
    }
    set({ items: newItems });
    saveCartToStorage(newItems);
  },

  // Remove item from cart
  removeItem: (materialId) => {
    const newItems = get().items.filter(item => item.materialId !== materialId);
    set({ items: newItems });
    saveCartToStorage(newItems);
  },

  // Update item quantity
  updateQuantity: (materialId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(materialId);
      return;
    }
    const newItems = get().items.map(item =>
      item.materialId === materialId
        ? { ...item, quantity }
        : item
    );
    set({ items: newItems });
    saveCartToStorage(newItems);
  },

  // Clear cart
  clearCart: () => {
    set({ items: [] });
    saveCartToStorage([]);
  },

  // Get total items count
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total price
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));

export default useCartStore;
