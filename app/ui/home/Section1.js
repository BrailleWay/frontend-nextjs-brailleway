import Image from 'next/image';
import React from 'react';

export default function Section1(){
    return(
        <>
            <div className="container gap-60 md:gap-9 lg:gap-50 2xl:gap-20 mt-20 mb-20 mx-auto flex flex-col-reverse lg:flex-row">

                <div id="container-esquerda" className='relative rounded-4xl lg:max-w-3xl w-full flex flex-row md:bg-gradient-to-r md:from-[#2180E1] md:from-24% md:via-[#3EC9D4] md:via-56% md:to-[#42D2D2] md:to-100%'>
                    <div className='lg:h-125 md:h-80 w-full lg:max-w-sm space-y-2 md:z-0 z-10 flex flex-col items-center md:items-start rounded-4xl md:bg-transparent md:via-transparent md:to-transparent md:from-transparent bg-gradient-to-r from-[#2180E1] from-24% via-[#3EC9D4] via-56% to-[#42D2D2] to-100%'>
                        <h2 className='text-white md:text-left text-center font-["Inter-semibold"] mt-10 text-4xl mx-10 md:max-w-sm'>Ouça nossas frequências</h2>
                        <h3 className='text-white md:text-left text-center font-["Inter-medium"] mx-10 md:max-w-sm'>Teste gratis e tenha acesso a nossos sons para relaxar</h3>
                        <button className='px-6.5 mb-5 bg-white text-black py-2.5 font-["Inter-semibold"] w-fit mx-10 mt-5 text-sm rounded-full'>Ouça Agora</button>
                    </div>
                    <Image className='2xl:w-125 lg:w-125 lg:left-60 lg:bottom-0 md:w-80 absolute z-0 2xl:left-80 2xl:bottom-0 md:bottom-0.25 md:left-130 object-cover bottom-22' src="/home/familia.png" alt='' width={1080} height={1080} />
                </div>

                <div id="merece-cuidados" className='flex flex-col lg:max-w-2xl'>
                    <h2 className='text-center lg:text-left lg:max-w-xl mb-8 text-7xl font-["Urbanist-medium"]'>Sua saúde merece <span className='font-["Urbanist-bold"] text-[#1C71E4]'>cuidados</span></h2>
                    <div className='h-0.5 w-full mb-5 bg-black'></div>
                    <h3 className='text-center lg:text-left font-["Poppins-regular"] text-xl'>Para quem enxerga com o coração e sente com a alma, a <span className='text-[#1C71E4] font-["Poppins-bold"]'>Acolhera</span> abre portas para consultas mais humanas, acessíveis e feitas para transformar vidas.</h3>
                    <div className='w-full flex justify-center'>
                        <button className='font-["Poppins-medium"] rounded-full text-white px-10 py-4.5 text-2xl mt-4 lg:mt-15 bg-gradient-to-r from-[#4090EC] from-0% via-[#1C71E4] via-51% to-[#44D7D1] to-100% w-fit'>Cadastre-se</button>
                    </div>
                </div>
            </div>
        </>
    )
}