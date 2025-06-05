import React from 'react';

export default function Section1(){
    return(
        <>
            <div className="">
                <div className="flex flex-row mt-20 gap-40 items-center">
                    <div className='flex items-end relative ml-20 w-213 h-177 justify-end'>
                        <div className='absolute z-10'>
                            <img className='object-cover h-180' src="./src/img/pessoa.png" alt="" />

                        </div>
                        <div className="absolute rounded-4xl shadow-xl/40 shadow-cyan-500 bg-gradient-to-r from-blue-500 to-teal-400 p-6 lg:p-12 w-213 h-160">
                            <div className="text-white space-y-4 max-w-xs">
                                <h3 class="text-5xl font-['Inter-semibold']">Ouça nossas <br class="sm:hidden" /> Frequências</h3>
                                <p class="text-3xl font-['Inter-medium']"> Teste grátis e tenha acesso a nossos sons para relaxar</p>
                                <button class="font-['Inter-semibold'] mt-4 inline-block bg-white text-black w-44 h-14 text-xl px-5 py-2 rounded-full shadow hover:shadow-md transition"> Ouça agora </button>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col w-200 h-160'>
                        <div className='pb-2 border-b-2'>
                            <h2 className='text-8xl h-46.5 mb-4'><span className='font-["Urbanist-medium"]'>Sua mente <br/> merece</span> <span className='text-[#1C71E4] font-["Urbanist-bold"]'>cuidados</span></h2>
                        </div>
                        <p className='text-xl mt-3 font-["Poppins-regular"]'>
                            Para quem enxerga com o coração e sente com a alma, o <span className='text-[#1C71E4] font-["Poppins-bold"]'>Braille Way</span> abre portas para uma terapia mais humana, acessível e feita para transformar vidas.
                        </p>
                        <div className='flex flex-col h-full items-center justify-center'>
                            <button class="font-['Poppins-medium'] text-2xl h-18 w-64 inline-block bg-gradient-to-r from-blue-500 to-teal-400 text-white  px-5 py-2 rounded-full shadow-md hover:shadow-md transition"> Cadastre-se </button>
                        </div>
                        <div className='flex w-200 items-end'>
                            <div className='border rounded-full flex w-49 h-22 relative items-center justify-center'>
                                <img className='p-2 absolute -left-[0.25px] z-1' src="./src/img/pessoa-container1.png"/>
                                <img className='p-2 absolute z-10' src="./src/img/pessoa-container2.png"/>
                                <img className='p-2 absolute -right-[0.1px] z-20' src="./src/img/pessoa-container3.png"/>
                            </div>
                            <div className='ml-3 w-full h-22 flex items-center'>
                                <p className='text-xl'><span className='font-["Urbanist-bold"]'>430+</span><span className='font-["Urbanist-semibold"]'>Usuários usam a Brailleway</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}