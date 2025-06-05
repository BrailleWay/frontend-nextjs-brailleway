import React from 'react';
import Image from 'next/image'

export default function PsychologistSection() {
  const psychologists = [
    {
      name: 'Julian Jameson',
      rating: 4.8,
      specialties: 'Adultos, Adolescentes',
      image: '/psych1.jpg',
    },
    {
      name: 'Julian Jameson',
      rating: 4.8,
      specialties: 'Adultos, Adolescentes',
      image: '/psych2.jpg',
    },
    {
      name: 'Julian Jameson',
      rating: 4.8,
      specialties: 'Adultos, Adolescentes',
      image: '/psych3.jpg',
    },
  ]

  return (
    <section className="py-12 px-6 bg-white flex flex-col md:flex-row items-start md:items-center justify-between max-w-7xl mx-auto">
      <div className="max-w-md mb-8 md:mb-0">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ache seu <span className="text-blue-600"> médico ideal</span>
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
        Encontre o médico perfeito para você! Avaliar o atendimento nos ajuda a garantir a qualidade dos serviços de telemedicina e a construir uma rede cada vez mais acolhedora e 
        eficiente em pediatria, psiquiatria e clínica geral. Compartilhe sua experiência de forma transparente e contribua para que outros usuários encontrem o cuidado que precisam!
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow">
          Ache Seu Psicólogo
        </button>
      </div>

      <div className="flex gap-4">
        {psychologists.map((psych, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl overflow-hidden w-64">
            <div className="h-48 relative">
              <Image src={psych.image} alt={psych.name} layout="fill" objectFit="cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{psych.name}</h3>
              <p className="text-sm text-gray-500">{psych.specialties}</p>
              <div className="flex items-center mt-2 text-yellow-500 text-sm">
                ★ {psych.rating}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-gray-100 px-2 py-1 text-xs rounded">#Amizade</span>
                <span className="bg-gray-100 px-2 py-1 text-xs rounded">#MaisOuvido</span>
              </div>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-full text-sm">
                Conectar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}