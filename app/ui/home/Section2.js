// src/components/VoceImporta.jsx
import Image from 'next/image'
import React from 'react'


export default function VoceImporta() {
  return (
    <section className="container mx-auto py-16 px-4 mt-8">
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <h2 className="text-6xl">
            <span className="block font-['Inter-medium'] text-[#343434]">Você importa. Sua</span>
            <span className="block font-['Inter-semibold'] text-[#1C71E4]">saúde mental também.</span>
          </h2>

          <div className="mt-8">
            <h3 className='text-2xl font-["Poppins-medium"]'>
              Compreender a si mesmo
            </h3>
            <p className='font-["Poppins-regular"]'>
              Descobrir o que sentimos e por quê é o primeiro passo para a mudança. A psicologia nos ajuda a entender nossas emoções, pensamentos e comportamentos, promovendo autoconhecimento e equilíbrio.
            </p>
          </div>

          <div className="mt-8">
            <h3 className='text-2xl font-["Poppins-medium"]'>
              Melhorar a Qualidade de Vida
            </h3>
            <p className='font-["Poppins-regular"]'>
              Ansiedade, estresse, tristeza profunda… não precisam ser enfrentados sozinhos. A terapia oferece apoio para lidar com os desafios emocionais e conquistar mais bem-estar no dia a dia.
            </p>
          </div>

          <div className="mt-8">
            <h3 className='text-2xl font-["Poppins-medium"]'>
              Fortalecer Relações e a Resiliência
            </h3>
            <p className='font-["Poppins-regular"]'>
              Relacionamentos difíceis e momentos duros fazem parte da vida – mas é possível aprender a enfrentá-los com mais leveza. Com apoio psicológico, você desenvolve habilidades para se conectar melhor com os outros e com você mesmo.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
            <div className='w-121 h-140'>
                <div className="relative">
                    <Image
                        src="/home/caraDaJaquetaAmarela.png"
                        alt=""
                        className="absolute z-10 block rounded-lg object-cover w-full h-auto"
                        width={486}
                        height={563}
                    />
                    <div className='left-10 top-20.25 h-120 w-121 absolute bg-gradient-to-r from-[#007cfb] to-[#00dfd8] rounded-3xl p-1'>

                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}
