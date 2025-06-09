'use client';

import Image from 'next/image';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function MudarPlanos() {
  const [ativo, setAtivo] = useState('planos');
}

export default function Section7(){
    return(
        <div className='bg-[linear-gradient(to_right,_#4BA8FF_0%,_#1C71E4_47%,_#44D7D1_100%)]'>
            <div className='text-white container lg:max-w-8xl mx-auto flex flex-col'>
                <h2 className='tracking-widest mt-3 font-["Poppins-medium"] text-center text-3xl'>Nossos Planos</h2>
                <h3 className=' text-center font-["Inter-medium"] text-base lg:text-lg lg:w-1/2 mx-3 lg:mx-auto'>Nossos Pacotes de Cuidados Acessíveis foram pensados para oferecer qualidade, conforto e bem-estar a preços justos.</h3>
                <div className='mt-4 flex flex-row items-center font-["Poppins-semibold"] rounded-full w-fit mx-auto outline-white outline p-1'>
                    <h3 className='text-blue-500 bg-white rounded-full p-2 text-center text-md w-20 mx-auto'>Planos</h3>
                    <h3 className='text-md p-2 rounded-full'>Avulso</h3>
                </div>
                <div id="planos" className='lg:justify-center sm:justify-center sm:mx-auto mt-4 gap-20 p-10 mb-10 md:mx-auto w-fit bg-white mx-2.5 lg:mx-auto rounded-4xl flex flex-col lg:flex-row font-["Poppins-medium"]'>
                    <div className='hover:shadow-3xl hover:-translate-y-10 ease-in-out container transition hover:scale-105 duration-300 group hover:bg-gradient-to-r hover:from-[#6941EB] hover:via-[#6941EB] hover:to-[#4BA8FF]  p-3 rounded-4xl bg-white'>
                        <div id="plano1" className='space-y-3  max-w-sm p-10  flex flex-col'>
                            <div className=' text-[#1C71E4] flex justify-end'><p className='bg-white rounded-4xl px-6 py-1 outline outline-[#6941EB] group-hover:outline-none transition duration-300 ease-in-out '>Mais Popular</p></div>
                            <h2 className='group-hover:text-white text-4xl font-["Poppins-bold"] text-[#231D4F]'>R$19 <span className='text-gray-400 text-lg group-hover:text-white'>/mês</span></h2>
                            <h3 className='group-hover:text-white text-[#231D4F] text-2xl'>Starter</h3>
                            <p className='group-hover:text-white text-gray-400 text-base'>Unleash the power of automation</p>
                            <div className='space-y-2 mt-2'>
                                <div className='group-hover:text-white flex flex-row gap-0.5 text-gray-400 items-center'>
                                    <Image alt="" src="/home/Shape.png" width={20} height={20} className='size-5'  />
                                    <p>Multi-step Zaps</p>
                                </div>
                                <div className='group-hover:text-white flex flex-row gap-0.5 text-gray-400 items-center'>
                                    <Image alt="" src="/home/Shape.png" width={20} height={20} className='size-5'  />
                                    <p>Multi-step Zaps</p>
                                </div>
                                <div className='group-hover:text-white flex flex-row gap-0.5 text-gray-400 items-center'>
                                    <Image alt="" src="/home/Shape.png" width={20} height={20} className='size-5'  />
                                    <p>Multi-step Zaps</p>
                                </div>
                            </div>
                                <button className='cursor-pointer mt-40 py-3 rounded-2xl bg-[linear-gradient(to_right,_#1E92A9_0%,_#498FE5_38%,_#4784F6_78%)]'>Comprar Agora</button>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}