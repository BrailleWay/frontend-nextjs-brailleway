import React from 'react';

const ComoComeçar = () => {
  return (
    <section className="">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-gray-800 mb-12 text-center">Como começar</h2>
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          <div className="flex-1 p-6 rounded-lg shadow-lg bg-blue-600 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-2xl font-bold">Encontre seu psicólogo ideal</h3>
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
                <h3 className="text-2xl font-bold">Agende sua Sessão</h3>
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
                <h3 className="text-2xl font-bold">Viva sua Experiência de Terapia</h3>
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

export default ComoComeçar;