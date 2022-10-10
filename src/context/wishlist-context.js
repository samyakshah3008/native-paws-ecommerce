import { createContext, useContext, useReducer } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const axios = require("axios").default;
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.isLoggedIn) {
      (async () => {
        const wishlistResponse = await axios.get("/api/user/wishlist", {
          headers: {
            authorization: auth.token,
          },
        });
        setWishlist(wishlistResponse.data.wishlist);
      })();
    } else {
      setWishlist([]);
    }
  }, [auth]);

  const addProductToWishlist = async (product) => {
    try {
      const addToWishlistResponse = await axios.post(
        "/api/user/wishlist",
        { product },
        {
          headers: {
            authorization: auth.token,
          },
        }
      );
      setWishlist(addToWishlistResponse.data.wishlist);
    } catch (error) {
      console.log(error);
    }
  };

  const removeProductFromWishlist = async (productId) => {
    try {
      const removeFromWishlistResponse = await axios.delete(
        `/api/user/wishlist/${productId}`,
        {
          headers: {
            authorization: auth.token,
          },
        }
      );
      setWishlist(removeFromWishlistResponse.data.wishlist);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist,
        addProductToWishlist,
        removeProductFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };
