import { useEffect, useState, createContext } from "react";

export const CartsContext = createContext();

const CartsPageProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    const cart =
      JSON.parse(localStorage.getItem("cartItem")) || [];

    setCartProducts(cart);
  }, []);

  const saveCart = (updatedCart) => {
    setCartProducts(updatedCart);

    localStorage.setItem(
      "cartItem",
      JSON.stringify(updatedCart)
    );
  };

  const addToCart = (product) => {
    const existingProduct = cartProducts.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = cartProducts.map((item) =>
        item.id === product.id
          ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
          : item
      );
    } else {
      updatedCart = [
        ...cartProducts,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartProducts.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };

  const updateQuantity = (id, type) => {
    const updatedCart = cartProducts.map((item) => {
      if (item.id !== id) return item;

      let quantity = item.quantity || 1;

      if (type === "increase") {
        quantity++;
      }

      if (type === "decrease") {
        quantity--;
      }

      if (quantity < 1) {
        quantity = 1;
      }

      return {
        ...item,
        quantity,
      };
    });

    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartsContext.Provider
      value={{
        cartProducts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartsContext.Provider>
  );
};

export default CartsPageProvider;