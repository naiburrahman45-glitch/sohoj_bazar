import { createContext, useContext, useEffect, useMemo, useState } from "react";

const C = createContext(null);

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem("sohoj_cart") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    localStorage.removeItem("sohoj_cart");
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem("sohoj_cart", JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity, cuttingStyle = "পুরো", customInstruction = "") {
    const qty = Math.max(0.1, Number(quantity) || 0.1);
    const id = `${product._id}-${cuttingStyle}`;

    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Number(item.quantity) + qty,
                customInstruction: customInstruction || item.customInstruction,
              }
            : item
        );
      }

      return [
        ...current,
        {
          id,
          productId: product._id,
          name: product.name,
          image: product.image || "",
          unit: product.unit || "কেজি",
          basePrice: Number(product.basePrice) || 0,
          quantity: qty,
          cuttingStyle,
          customInstruction,
          cuttingCharge: Number(
            product.cuttingOptions?.find((o) => o.name === cuttingStyle)?.extraCharge || 0
          ),
        },
      ];
    });
  }

  function updateQuantity(id, quantity) {
    const qty = Math.max(0.1, Number(quantity) || 0.1);
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (Number(item.basePrice) + Number(item.cuttingCharge)) * Number(item.quantity),
        0
      ),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity), 0),
    [items]
  );

  return (
    <C.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal, count }}>
      {children}
    </C.Provider>
  );
}

export const useCart = () => useContext(C);
