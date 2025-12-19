import React, { useEffect, useState } from 'react'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

const BannerProduct = () => {
    const [currentImage, setCurrentImage] = useState(0)

    const desktopImages = [
        "https://placehold.co/1200x400/003399/ffffff?text=Promo+Condor+Electronics+Algerie",
        "https://placehold.co/1200x400/ff9900/000000?text=Jumia+DZ+Anniversaire+-+Soldes",
        "https://placehold.co/1200x400/ed1c24/ffffff?text=Ooredoo+4G+Plus+-+Internet+Rapide",
        "https://placehold.co/1200x400/1428a0/ffffff?text=Samsung+Algerie+-+Galaxy+S24+Ultra",
        "https://placehold.co/1200x400/000000/ffffff?text=Brandt+Algerie+-+Electromenager"
    ]

    const mobileImages = [
        "https://placehold.co/600x400/003399/ffffff?text=Promo+Condor+DZ",
        "https://placehold.co/600x400/ff9900/000000?text=Jumia+Soldes",
        "https://placehold.co/600x400/ed1c24/ffffff?text=Ooredoo+4G",
        "https://placehold.co/600x400/1428a0/ffffff?text=Samsung+DZ",
        "https://placehold.co/600x400/000000/ffffff?text=Brandt+Promo"
    ]

    const nextImage = () => {
        if (desktopImages.length - 1 > currentImage) {
            setCurrentImage(preve => preve + 1)
        }
    }

    const preveImage = () => {
        if (currentImage !== 0) {
            setCurrentImage(preve => preve - 1)
        }
    }


    useEffect(() => {
        const interval = setInterval(() => {
            if (desktopImages.length - 1 > currentImage) {
                nextImage()
            } else {
                setCurrentImage(0)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [currentImage, desktopImages.length, nextImage])

    return (
        <div className='container mx-auto px-4 md:px-8 mt-6 rounded-2xl'>
            <div className='h-64 md:h-96 w-full bg-slate-100 relative rounded-2xl overflow-hidden shadow-soft group'>

                {/* Navigation Buttons */}
                <div className='absolute z-20 h-full w-full md:flex items-center hidden justify-between px-4'>
                    <button onClick={preveImage} className='bg-white/80 backdrop-blur-sm shadow-md rounded-full p-3 hover:bg-white hover:text-primary text-text-main transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300'><FaAngleLeft /></button>
                    <button onClick={nextImage} className='bg-white/80 backdrop-blur-sm shadow-md rounded-full p-3 hover:bg-white hover:text-primary text-text-main transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300'><FaAngleRight /></button>
                </div>



                {/**desktop and tablet version */}
                <div className='hidden md:flex h-full w-full overflow-hidden'>
                    {
                        desktopImages.map((imageURl, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-transform duration-700 ease-in-out' key={imageURl} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURl} alt={'banner-' + index} className='w-full h-full object-cover object-right' />
                                </div>
                            )
                        })
                    }
                </div>


                {/**mobile version */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                    {
                        mobileImages.map((imageURl, index) => {
                            return (
                                <div className='w-full h-full min-w-full min-h-full transition-transform duration-700 ease-in-out' key={imageURl} style={{ transform: `translateX(-${currentImage * 100}%)` }}>
                                    <img src={imageURl} alt={'banner-mobile-' + index} className='w-full h-full object-cover' />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default BannerProduct
