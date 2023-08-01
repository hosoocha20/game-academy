import React,  { useState } from 'react'
import {RxCross1} from'react-icons/rx';

const ProductCardExpand = ({image, item, description, price, closeProductCardOnClick}) => {
  return (
    <div className="grid grid-cols-2 col-span-full border px-[3%]">
        <div className='flex flex-col justify-between items-center py-[5%] px-[8%] relative'>
            <img alt="Item Image" className='h-[100%] object-contain' src={`https://cws.auckland.ac.nz/gas/api/ItemPhoto/${image}`}/>
            <div className='text-center'>{item}</div>
            <div>{"$"+price}</div>
        </div>
        <div className='flex flex-col gap-[4%] py-[5%]'>
            <div className='flex justify-end'>
                <RxCross1 className='cursor-pointer' onClick={closeProductCardOnClick}/>
            </div>
            <h4 className='font-medium text-[1.2rem]'>Description</h4>
            <p>{description}</p>
        </div>
    </div>
  )
}

export default ProductCardExpand