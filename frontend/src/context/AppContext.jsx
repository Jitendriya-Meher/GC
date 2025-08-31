import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProovide = ({children}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const currency = "₹";

    const [showUserLogin, setShowUserLogin] = useState(false);

    const [products, setProducts] = useState([]);

    const [cartItems, setCartItems] = useState({});

    const [searchQuery, setSearchQuery] = useState("");

    // fetch user and cart status
    const fetchUser = async () => {

        try{

            const {data} = await axios.get("api/user/is-auth");

            if( data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems);
            }
            else{
                setUser(null);
                // toast.error(data.message);
            }
 
        }
        catch(err){
            setUser(null);
            toast.error(err.message);
        }

    }

    // fetch seller status
    const fetchSeller = async () => {

        try{

            const {data} = await axios.get("api/seller/is-auth");

            if( data.success){
                setIsSeller(true);
            }
            else{
                setIsSeller(false);
                // toast.error(data.message);
            }

        }
        catch(err){
            setIsSeller(false);
            toast.error(err.message);
        }

    }

    // get all preducts
    const fetchProducts = async () => {

        try {

            const {data} = await axios.get("/api/product/list");

            if( data.success){
                setProducts(data.products);
            }
            else{
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }

    // add product to cart
    const addToCart = (itemId) => {

        let cartData = structuredClone(cartItems);

        if( cartData[itemId]){
            cartData[itemId] += 1;
        }
        else{
            cartData[itemId] = 1;
        }

        setCartItems(cartData);
        toast.success("Added to Cart");

    }

    // update cart item quantity
    const updateCartItem = (itemId, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId] = quantity;

        setCartItems(cartData);
        toast.success("Cart Updated");

    }

    // remove product from cart
    const removeFromCart = async (itemId) => {

        let cartData = structuredClone(cartItems);

        if( cartData[itemId]){

            cartData[itemId] -= 1;

            if( cartData[itemId] == 0){
                delete cartData[itemId];
            }
        }

        setCartItems(cartData);
        toast.success("Remove from cart");

    }

    // cart item count
    const getCartCount = () => {

        let totalCount = 0;

        for( const item in cartItems){
            totalCount += cartItems[item];
        }

        return totalCount;

    }

    const getCartTotalAmount = () => {

        let totalAmount = 0;

        for( const item in cartItems){
            
            let itemInfo = products.find((product) => product._id === item);

            if( cartItems[item] > 0){
                totalAmount += itemInfo.offerPrice * cartItems[item];
            }
        }

        return Math.floor( totalAmount * 100) / 100;

    }

    useEffect(() => {

        fetchProducts();
        fetchSeller();
        fetchUser();

    },[]);


    useEffect(() => {

        const updateCart = async () => {

            try{
                const {data} = await axios.post("/api/cart/update",{
                    cartItems
                });

                if( !data.success){
                    toast.error(data.message);
                }
            }
            catch(err){
                toast.error(err.message);
            }

        }

        if( user){
            updateCart();
        }

    },[cartItems]);


    const value = {
        navigate,
        user,
        setUser,
        setIsSeller,
        isSeller,
        showUserLogin, 
        setShowUserLogin,
        products,
        fetchProducts,
        currency,
        addToCart,
        updateCartItem,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        getCartCount,
        getCartTotalAmount,
        axios,
        setCartItems
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = () => {

    return useContext(AppContext);

}