import Image from 'next/image';
import React from 'react';
import Button from '@/components/Button';

export default function Section1() {
    return (
        <>
            <div className="container gap-60 md:gap-9 lg:gap-24 2xl:gap-20 mt-20 mb-20 mx-auto flex flex-col-reverse lg:flex-row">

                <div
                    id="container-esquerda"
                    className='relative rounded-4xl lg:max-w-3xl w-full flex flex-row md:bg-gradient-to-r md:from-[#2180E1] md:from-24% md:via-[#3EC9D4] md:via-56% md:to-[#42D2D2] md:to-100%'
                    style={{
                        boxShadow: '0 16px 32px -8px rgba(33, 201, 212, 0.65)'
                    }}
                >
                    <div className='lg:h-100 md:h-80 w-full lg:max-w-none space-y-2 md:z-0 z-10 flex flex-col items-center md:items-start rounded-4xl md:bg-transparent md:via-transparent md:to-transparent md:from-transparent bg-gradient-to-r from-[#2180E1] from-24% via-[#3EC9D4] via-56% to-[#42D2D2] to-100%'>
                        <h2 className='text-white md:text-left text-center font-["Inter-semibold"] mt-10 text-4xl mx-10 md:max-w-sm'>Ouça nossas frequências</h2>
                        <h3 className="text-white md:text-left text-center font-regular font-inter mx-10 md:max-w-sm">
                            Teste gratis<br /> e tenha acesso <br />a nossos sons <br />para relaxar
                        </h3>
                        <Button
                            style={{
                                background: 'white',
                                color: '#1c1c1c',
                                padding: '10px 28px',
                                borderRadius: '9999px',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 500,
                                fontSize: '1rem',
                                margin: '1.25rem 1.5rem 1.25rem 1.5rem',
                                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                                position: 'relative',
                            }}
                        >
                            Ouça Agora
                        </Button>

                        <Image
                            className='w-[490px] object-cover mt-[-396px] ml-[151px]'
                            src="/home/familia (4).png"
                            alt=''
                            width={1020}
                            height={1020}
                        />
                    </div>



                    
                </div>

                <div id="merece-cuidados" className='flex flex-col lg:max-w-2xl'>
                    <h2 className='text-center lg:text-left lg:max-w-xl mb-8 text-7xl font-["Urbanist-medium"] '>
                      <span className= 'text-[#343434]' >  Sua saúde merece </span> <span className='font-["Urbanist-bold"] text-[#1C71E4]'>cuidados</span>
                    </h2>
                    <div className='h-0.5 w-full mb-5 bg-black'></div>
                    <h3 className='text-center lg:text-left font-["Poppins-regular"] text-xl text-[#343434]'>
                        Para quem enxerga com o coração e sente com a alma, a <span className='text-[#1C71E4] font-["Poppins-bold"]'>Acolhera</span> abre portas para consultas mais humanas, acessíveis e feitas para transformar vidas.
                    </h3>
                    <div className='w-full flex justify-center'>
                        <button className='font-["Poppins-regular"] rounded-full text-white px-10 py-4.5 text-2xl mt-4 lg:mt-15 bg-gradient-to-r from-[#4090EC] from-0% via-[#1C71E4] via-51% to-[#44D7D1] to-100% w-fit'>
                            Cadastre-se
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}