import Image from 'next/image';
import React from 'react';

export default function VoceImporta(){

  return (
    <section className="">
      <div className="container mx-auto px-4">
        <div className='md:flex md:flex-row md:items-center'>
          <div className='abosulte h-15 mt-3'>
          <h2 className="text-4xl font-['Inter-medium'] text-gray-800 md:mb-12 text-left">Como <span className="font-['Inter-semibold']">começar</span></h2>
          <Image className='md:hidden left-70 bottom-32 relative w-25 md:bottom-32 md:left-5 z-10' alt='' src="/home/mulher-comecar.png" width={171} height={221} />
          <Image className='md:hidden left-70 bottom-43.25 relative w-25 md:bottom-43.5 md:left-5 z-0' alt='' src="/home/Rectangle 48.png" width={198} height={90} />
          </div>
          <div className="">
            <div className='md:absolute'>
              <Image className='hidden md:block md:relative w-25 md:bottom-28 md:left-5 z-10' alt='' src="/home/mulher-comecar.png" width={171} height={221} />
              <Image className='hidden md:block md:relative w-25 md:bottom-39.25 md:left-5 z-0' alt='' src="/home/Rectangle 48.png" width={198} height={90} />
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex-1 p-6 rounded-lg shadow-lg bg-blue-600 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-2xl font-['Inter-medium']">Encontre seu <span className='font-["Inter-bold"]'>psicólogo ideal</span></h3>
              </div>
              <p className="text-sm">
                Acesse a plataforma Braille Way, navegue de forma simples e escolha o psicólogo que combina com suas necessidades e preferências. Tudo pensado para ser acessível e acolhedor.
              </p>
            </div>
          </div>

          <div className="flex-1 p-6 rounded-lg shadow-lg bg-blue-400 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-2xl font-['Inter-medium']">Agende sua <span className="font-['Inter-bold']">Sessão</span></h3>
              </div>
              <p className="text-sm">
                Defina o melhor horário para você, de forma prática e rápida. Nosso sistema garante privacidade, autonomia e suporte para que você se sinta seguro durante todo o processo.
                Se quisar diga brailinho e nosso assistente ia irá te ajudar.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex-1 p-6 rounded-lg shadow-lg bg-teal-400 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                {/* Placeholder for icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.332 14.042a1 1 0 011.218.011l3.153 2.294a1 1 0 001.26-.011l3.153-2.294a1 1 0 011.218-.011l3.153 2.294a1 1 0 001.26-.011l3.153-2.294a1 1 0 011.218.011l-12.888 9.362a1 1 0 01-1.218-.011L4.332 14.042z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.668 4.042a1 1 0 011.218.011l3.153 2.294a1 1 0 001.26-.011l3.153-2.294a1 1 0 011.218.011l-12.888 9.362a1 1 0 01-1.218-.011L9.668 4.042z" />
                </svg>
                <h3 className="text-2xl font-['Inter-medium']">Viva sua <span className="font-['Inter-bold']">Experiência de Terapia</span></h3>
              </div>
              <p className="text-sm">
                No dia marcado, basta acessar seu login e se conectar com seu psicólogo. Com tecnologia adaptada e linguagem acolhedora, você terá um espaço para falar, sentir e transformar sua saúde mental.
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center">
          <a href="/cadastro" className="inline-block bg-gradient-to-r from-teal-400 to-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition duration-300">
            Começar Hoje
          </a>
        </div>
      </div>
    </section>
  );
};
