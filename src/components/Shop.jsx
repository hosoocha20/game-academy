import React, { useEffect, useState } from 'react'
import {IoIosSearch} from 'react-icons/io';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductCardExpand from './ProductCardExpand';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [openProduct, setOpenProduct] = useState();

     const fetchProducts = async () =>{
        try{
            const data = await axios.get('https://cws.auckland.ac.nz/gas/api/AllItems');
            const productData = await data.data;
            setProducts(productData);
            //console.log(productData);

        } catch(err){
            console.log(err)
        }
     }


     const handleSearchFormSubmit =(e) =>{
        e.preventDefault();
     }
     const handleSearchInputChange = (e)=>{
        setSearchInput(e.target.value);
        if (e.target.value ===''){
            fetchProducts();
            return
        }
        axios.get(`https://cws.auckland.ac.nz/gas/api/Items/${e.target.value}`)
            .then((data)=>{
                return data.data;
            }).then(searchedData => setProducts(searchedData))
            .catch(err => console.log(err));
    
     }

     const growProductCardOnClick = (id) =>{
        setOpenProduct(id);
      }

      const closeProductCardOnClick = () =>{
        setOpenProduct(null);
      }

     useEffect(()=>{
        fetchProducts();
     },[])
  return (
    <div className='h-fit pt-[4.875rem]'>
        <div className='shop-background bg-black h-[32%] min-h-[200px] pb-[5%] pt-[3%] flex flex-col gap-[50%] items-center'>
            <h1 className='text-my-white text-5xl'>The Game Shop</h1>
            <div className='w-[40%] border py-[0.5%] bg-white rounded-[2rem]'>
                <form className='bg-transparent flex justify-between items-center px-[3%] h-fuil' id='searchBar' onSubmit={handleSearchFormSubmit}>
                    <input className='bg-transparent w-full h-full' type='search' placeholder='Search Items...' value={searchInput} onInput={handleSearchInputChange}/>
                    <IoIosSearch />
                </form>
            </div>
        </div>
        <div className='productCards-grid-container  grid grid-cols-fluid-card gap-[20px] px-[15%] py-[3%] grid-flow-row-dense'>
            {products.map(obj => (
                <>
                <ProductCard  key={obj.id} id={obj.id} image={obj.id} item={obj.name} description={obj.description} price={obj.price} growProductCardOnClick={growProductCardOnClick} openProduct={openProduct} closeProductCardOnClick={closeProductCardOnClick}/>
                {obj.id === openProduct ? (
                    <ProductCardExpand key={obj.id} image={obj.id} item={obj.name} description={obj.description} price={obj.price} closeProductCardOnClick={closeProductCardOnClick}/>
                ) : ""}
                
                </>
            ))
            }
                
            
            
        </div>
    </div>
  )
}

export default Shop