// useNavigation.js
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export const useNavigation = (speak) => {
  const navigate = useNavigate();
  const [introductionPlayed, setIntroductionPlayed] = useState(false);

  const handleNavigation = (key, products, index, cart, setCart) => {
    switch (key) {
      case 'v':
        navigate(`/product/${products[index].slug}`);
        break;
      case 'x':
        navigate('/cart');
        break;
      case 'b':
        addToCart(products[index], cart, setCart);
        break;
      case 'r':
        removeCartItem(products[index]._id, cart, setCart);
        break;
      case 'n':
        navigate('/');
        break;
      default:
        break;
    }
  };

  const addToCart = (product, cart, setCart) => {
    setCart([...cart, product]);
    localStorage.setItem('cart', JSON.stringify([...cart, product]));
    toast.success('Item Added to cart');
  };

  const removeCartItem = (productId, cart, setCart) => {
    let updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.error('Item Removed from cart');
  };

  const introduceNavigationOptions = () => {
    if (!introductionPlayed) {
      const text = "Use arrow keys to navigate through products. Press 'V' to view details, 'X' to view cart, 'B' to add to cart, 'R' to remove from cart, and 'N' to go back to the homepage.";
      speak(text);
      setIntroductionPlayed(true);
    }
  };

  const handleKeyPress = (e) => {
    // Check if the pressed key is 'Q'
    if (e.key.toLowerCase() === 'q') {
      // Introduce the navigation options
      introduceNavigationOptions();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return { handleNavigation, introduceNavigationOptions };
};
