import React from 'react';
export default function SobreNos() {
    return (
      <section className="bg-white py-12 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
        
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-600 uppercase">Sobre Nós</span>
          </div>
  
          <h2 className="text-4xl font-bold text-gray-800">
            Transformando vidas <span className="text-blue-600">por meio do cuidado</span>
          </h2>
  
          <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-xl">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Quem Somos</h3>
            <p className="text-gray-700">
              O BrailleWay promove o bem-estar psicológico para todos, com foco especial no cuidado de pessoas com deficiência visual, oferecendo uma plataforma acessível, privativa e fácil de usar.
            </p>
           
          </div>
        </div>
  
        <div className="flex-1 flex justify-center">
          <div className="bg-blue-100 p-4 rounded-xl">
            
          </div>
        </div>
  
      </section>
    )
  }
  