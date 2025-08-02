import React, { useEffect, useState } from "react";
import axios from "axios";
import '../App.css'
import Card from "../Card";
import { useDispatch, useSelector} from 'react-redux'
import { addToCart } from "../Redux/CartSlice";


const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const getPosts = () => {
    setLoading(true);
    axios
      .get("https://fakestoreapi.com/products/", {
        params: { _limit: 10, _page: currentPage },
      })
      .then((res) => {
        setData((prev) => [...prev, ...res.data]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const onScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;
      if (scrollBottom && !loading) {
        setCurrentPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading]);

 const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log("Current Cart : ", cartItems);
};

  return (
    <>
    <div className="bg-gray-100">
      <h1 className="text-7xl text-center ">Welcome to Shopsphere! </h1>
      <h2 className="text-4xl text-center">Your one stop shop for everything you need!</h2>
      <br /><br />
      <div className=" grid grid-flow-row grid-cols-5 gap-4">
      {data.map((el) => (
        <div className="border-0.5 rounded-lg w-64 p-2 shadow-xl/30 flex flex-col items-center">
            {/* <Card
            key = {el.id}
            image = {el.image}
            title = {el.title}
            price = {el.price}
            /> */}
            <img src={el.image} alt={el.title} className="size-40 self-center"/>
            <h2 className="font-serif text-center text-xl">{el.title}</h2>
            <h4 className="text-center">${el.price}</h4>
            <button className="border-1 rounded-xs p-2 bg-amber-200 hover:bg-blue-400 duration-300 ease-out " onClick={() => handleAddToCart(el)}>Add to Cart</button>

        </div>
      ))}
      </div>
      {loading && <p>Loading...</p>}
      </div>
    </>
  );
};

export default Home;


