import Image from 'next/image';
import React from 'react';

export default function VoceImporta(){

  return (
    <section className="mt-40">
      <div className="container mx-auto px-4">
        <div className='md:flex md:flex-row md:items-center mb-7'>
          <div className='abosulte h-15 mt-3'>
          <h2 className="md:text-5xl text-sm font-poppins font-medium text-[#4B4B4B] md:mb-12 text-left">Como <span className="font-poppins font-semibold text-[#1C71E4]">começar</span></h2>
          <Image className='  md:hidden bottom-50  left-70   relative w-25 md:bottom-32 md:left-5 z-10 '  alt='
          
          ' src="/home/mulher-comecar.png" width={171} height={221} />
          <Image className='md:hidden bottom-61 left-70  relative w-25 md:bottom-43.5 md:left-5 z-0' alt='
          
          ' src="/home/Rectangle 48.png" width={198} height={90} />
          </div>
          <div className="">
            <div className='md:absolute'>
              <Image className='hidden md:block md:relative w-25 md:bottom-28 md:left-5 z-10' alt='' src="/home/mulher-comecar.png" width={171} height={221} />
              <Image className='hidden md:block md:relative w-25 md:bottom-39.25 md:left-5 z-0' alt='' src="/home/Rectangle 48.png" width={198} height={90} />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-12 ">
          <div className="card-hover flex-1 p-6 rounded-lg shadow-lg  text-white flex flex-col justify-between"
            style={{ backgroundColor: '#1C71E4' ,
    boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.25)'
 }}
            >
            <div className=''>
              <div className="flex items-center mb-4 ">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-2xl font-inter font-medium">Encontre seu <span className='font-inter font-bold'> médico ideal</span></h3>
              </div>
              <p className="text-sm font-inter font-semibold">
                Acesse a plataforma Braille Way, navegue de forma simples e escolha o especialista que combina com suas necessidades e preferências. Tudo pensado para ser acessível e acolhedor.
              </p>
            </div>
          </div>

          <div className="card-hover flex-1 p-6 rounded-lg shadow-lg  text-white flex flex-col justify-between"
          style={{ backgroundColor: '#4BA8FF' ,
    boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.25)'}}>
            
            
            <div>
              <div className=" flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-2xl font-inter font-medium">Agende sua <span className="font-inter font-bold">Consulta</span></h3>
              </div>
              <p className="text-sm font-inter font-semibold">
                Defina o melhor horário para você, de forma prática e rápida. Nosso sistema garante privacidade, autonomia e suporte para que você se sinta seguro durante todo o processo.
                Se quisar diga brailinho e nosso assistente IA irá te ajudar.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card-hover flex-1 p-6 rounded-lg shadow-lg  text-white flex flex-col justify-between"
           style={{ backgroundColor: '#66DDE2' ,
    boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.25)'}}>
            <div>
              <div className="flex items-center mb-4">
                {/* Placeholder for icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.332 14.042a1 1 0 011.218.011l3.153 2.294a1 1 0 001.26-.011l3.153-2.294a1 1 0 011.218-.011l3.153 2.294a1 1 0 001.26-.011l3.153-2.294a1 1 0 011.218.011l-12.888 9.362a1 1 0 01-1.218-.011L4.332 14.042z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.668 4.042a1 1 0 011.218.011l3.153 2.294a1 1 0 001.26-.011l3.153-2.294a1 1 0 011.218.011l-12.888 9.362a1 1 0 01-1.218-.011L9.668 4.042z" />
                </svg>
                <h3 className="text-2xl font-inter font-medium']">Viva sua <span className="font-inter font-bold">Experiência</span></h3>
              </div>
              <p className="text-sm font-inter font-semibold">
                No dia marcado, basta acessar seu login e se conectar com o profissional escolhido. Com tecnologia adaptada e linguagem acolhedora, você terá um espaço para falar, sentir e transformar sua saúde física e mental.
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center">
          <a href="/cadastro" className="font-poppins
                        rounded-full
                        text-white
                        px-5
                        py-2.5
                        text-sm
                        md:text-1xl
                        mt-4
                        bg-gradient-to-r
                        from-[#4090EC]
                        via-[#1C71E4]
                        to-[#44D7D1]
                        w-fit
                        mx-auto
                        block
                        shadow-[0_4px_16px_-2px_rgba(0,0,0,0.18)]
                        transition
                        duration-200
                        hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.28)]
                        hover:scale-105
                        active:scale-100
                        cursor-pointer
                        ">
            Começar Hoje
          </a>
        </div>
      </div>
    </section>
  );
};
