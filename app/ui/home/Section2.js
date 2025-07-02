// src/components/VoceImporta.jsx
import Image from 'next/image'
import React from 'react'
import './Section2.css'

export default function VoceImporta() {
  return (
    <section
      className="container mx-auto py-16 px-4"
      aria-labelledby="voce-importa-titulo"
    >
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Texto */}
        <div className="w-full md:w-1/2">
          <h2
            id="voce-importa-titulo"
            className="text-5xl"
          >
            <span className="block text-[#343434] font-inter font-medium">Você importa, sua</span>
            <span className="block text-[#1C71E4] font-inter font-semibold">saúde também.</span>
          </h2>

          <article className="mt-8" aria-labelledby="titulo-autoconhecimento">
            <h3
              id="titulo-autoconhecimento"
              className="font-poppins font-medium text-xl text-[#343434] mb-4"
            >
              Compreender a si mesmo
            </h3>
            <p className="text-[#343434] font-poppins">
              Descobrir o que sentimos e por quê é o primeiro passo para a mudança.
              A Medicina nos ajuda a entender nossas dores, pensamentos e comportamentos, 
              promovendo autoconhecimento e equilíbrio físico e mental.
            </p>
          </article>

          <article className="mt-8" aria-labelledby="titulo-qualidade">
            <h3
              id="titulo-qualidade"
              className="font-poppins font-medium text-xl text-[#343434] mb-4"
            >
              Melhorar a Qualidade de Vida
            </h3>
            <p className="text-[#343434] font-poppins">
              Ansiedade, estresse e dores inexplicáveis… não precisam ser enfrentados sozinhos.
              A terapia oferece apoio para lidar com os desafios emocionais e conquistar mais bem-estar no dia a dia.
            </p>
          </article>

          <article className="mt-8" aria-labelledby="titulo-relacoes">
            <h3
              id="titulo-relacoes"
              className="font-poppins font-medium text-xl text-[#343434] mb-4"
            >
              Fortalecer Relações e a Resiliência
            </h3>
            <p className="text-[#343434] font-poppins">
              Relacionamentos difíceis e momentos duros fazem parte da vida, mas é possível
              aprender a enfrentá-los com mais leveza. Com apoio psiquiátrico, você desenvolve
              habilidades para se conectar melhor com os outros e com você mesmo.
            </p>
          </article>
        </div>

        {/* Imagem */}
        <div className="w-full md:w-1/2 flex justify-center" aria-hidden="false">
          <div className="imagem-container relative" role="img" aria-label="Homem de jaqueta amarela com expressão contemplativa, posicionado à direita da tela.">
            <Image
              src="/home/caraDaJaquetaAmarela.webp"
              alt="Homem de jaqueta amarela com expressão contemplativa"
              width={486}
              height={563}
              className="imagem-principal"
              sizes="(max-width: 767px) 100vw, 50vw"
            />
            <div className="gradient-bg" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
