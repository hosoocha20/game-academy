import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import ProductCard from "./ProductCard";
import ProductCardExpand from "./ProductCardExpand";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [openProduct, setOpenProduct] = useState();

  const expandRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const data = await axios.get(
        "https://cws.auckland.ac.nz/gas/api/AllItems"
      );
      const productData = await data.data;
      setProducts(productData);
      //console.log(productData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
  };
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      fetchProducts();
      return;
    }
    axios
      .get(`https://cws.auckland.ac.nz/gas/api/Items/${e.target.value}`)
      .then((data) => {
        return data.data;
      })
      .then((searchedData) => setProducts(searchedData))
      .catch((err) => console.log(err));
  };

  const growProductCardOnClick = (id) => {
    setOpenProduct(id);
    expandRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const closeProductCardOnClick = () => {
    setOpenProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  useLayoutEffect(() => {
    expandRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [openProduct]);
  return (
    <div className="h-fit pt-[4.875rem] w-full">
      <div className="shop-background bg-black h-[32%] min-h-[200px] pb-[2%] pt-[2%] flex flex-col  items-center  w-full">
        <div className="border px-[1.8rem] md:py-[0.8rem] py-[0.4rem] rounded-[0.5rem] gameShopBorder">
          <h1 className="text-my-white text-[2.2rem] md:text-[3.5rem] text-center neonGame">
            GAME
          </h1>
          <h1 className="text-my-white text-[2.2rem] md:text-[3.5rem] text-center neonShop">
            SHOP
          </h1>
        </div>

        <div className="w-[70vw] md:w-[45%]  py-[0.5%] bg-white/70 rounded-[2rem] md:mt-[2rem] mt-[1rem]">
          <form
            className="bg-transparent flex justify-between items-center pr-[3%] pl-[4%] h-fuil w-full"
            id="searchBar"
            onSubmit={handleSearchFormSubmit}
          >
            <input
              className="bg-transparent w-full h-full focus:outline-none placeholder-gray-800"
              type="search"
              placeholder="Search Items..."
              value={searchInput}
              onInput={handleSearchInputChange}
            />
            <IoIosSearch />
          </form>
        </div>
      </div>
      <div className="productCards-grid-container  grid grid-cols-fluid-card gap-[20px] px-[15%] py-[3%] grid-flow-row-dense">
        {products.map((obj) => (
          <React.Fragment key={obj.id}>
            <ProductCard
              id={obj.id}
              image={obj.id}
              item={obj.name}
              description={obj.description}
              price={obj.price}
              growProductCardOnClick={growProductCardOnClick}
              openProduct={openProduct}
              closeProductCardOnClick={closeProductCardOnClick}
            />
            {obj.id === openProduct ? (
              <ProductCardExpand
                ref={expandRef}
                image={obj.id}
                item={obj.name}
                description={obj.description}
                price={obj.price}
                closeProductCardOnClick={closeProductCardOnClick}
              />
            ) : (
              ""
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Shop;
