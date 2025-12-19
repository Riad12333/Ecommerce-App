import React from 'react'
import { FaShoppingBag } from "react-icons/fa";

const Logo = ({ w, h }) => {
    return (
        <div className='flex items-center gap-2'>
            <FaShoppingBag className='text-3xl text-primary' />
            <div className='flex flex-col'>
                <span className='font-bold text-xl font-heading text-text-main leading-none'>Madjid<span className='text-accent'></span></span>
                <span className='text-xs text-text-secondary font-medium tracking-wider'>Shop Here</span>
            </div>
        </div>
    )
}

export default Logo
