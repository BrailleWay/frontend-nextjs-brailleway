import Image from 'next/image';
import React from 'react';

export default function Section1(){
    return(
        <>
            <div className="container gap-20 mt-20 mb-20 mx-auto flex flex-col-reverse lg:flex-row">

                <div id="container-esquerda" className='relative rounded-4xl lg:max-w-3xl w-full flex flex-row md:bg-gradient-to-r md:from-[#2180E1] md:from-24% md:via-[#3EC9D4] md:via-56% md:to-[#42D2D2] md:to-100%'>
                    <div className='lg:h-125 md:h-80 w-full lg:max-w-sm space-y-2 md:z-0 z-10 flex flex-col items-center md:items-start rounded-4xl md:bg-transparent md:via-transparent md:to-transparent md:from-transparent bg-gradient-to-r from-[#2180E1] from-24% via-[#3EC9D4] via-56% to-[#42D2D2] to-100%'>
                        <h2 className='text-white md:text-left text-center font-["Inter-semibold"] mt-10 text-4xl mx-10 md:max-w-sm'>Ouça nossas frequências</h2>
                        <h3 className='text-white md:text-left text-center font-["Inter-medium"] mx-10 md:max-w-sm'>Teste gratis e tenha acesso a nossos sons para relaxar</h3>
                        <button className='px-6.5 mb-5 bg-white text-black py-2.5 font-["Inter-semibold"] w-fit mx-10 mt-5 text-sm rounded-full'>Ouça Agora</button>
                    </div>
                    <Image className='lg:w-125 md:w-80 absolute z-0 lg:left-80 lg:bottom-0 md:bottom-0.25 md:left-130 object-cover bottom-22' src="/home/familia.png" alt='' width={1080} height={1080} />
                </div>

                <div id="merece-cuidados">

                </div>
            </div>
        </>
    )
}