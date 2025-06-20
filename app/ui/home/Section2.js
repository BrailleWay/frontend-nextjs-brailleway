// src/components/VoceImporta.jsx
import Image from 'next/image'
import React from 'react'
import './Section2.css';


export default function VoceImporta() {
  return (
    <section className="container mx-auto py-16 px-4">
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Texto */}
        <div className="w-full md:w-1/2">
          <h2 className="titulo-principal font:">
            <span className="block texto-preto">Você importa sua</span>
            <span className="block texto-azul">saúde mental também.</span>
          </h2>

          <div className="bloco-texto">
            <h3 className="subtitulo">Compreender a si mesmo</h3>
            <p className="texto">
              Descobrir o que sentimos e por quê é o primeiro passo  <br /> para a mudança. A psicologia nos ajuda a entender nossas emoções, pensamentos e comportamentos, <br /> promovendo autoconhecimento e equilíbrio.
            </p>
          </div>

          <div className="bloco-texto">
            <h3 className="subtitulo">Melhorar a Qualidade de Vida</h3>
            <p className="texto">
              Ansiedade, estresse, tristeza profunda… não precisam <br /> ser enfrentados sozinhos. A terapia oferece apoio para lidar com os desafios emocionais e conquistar mais bem-estar no dia a dia.
            </p>
          </div>

          <div className="bloco-texto">
            <h3 className="subtitulo">Fortalecer Relações e a Resiliência</h3>
            <p className="texto">
              Relacionamentos difíceis e momentos duros fazem <br /> parte da vida – mas é possível aprender a enfrentá-los com mais leveza. Com apoio psicológico, você desenvolve habilidades para se conectar melhor com os outros e com você mesmo.
            </p>
          </div>
        </div>

        {/* Imagem */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="imagem-container">
            <div className="relative">
              <Image
                src="/home/caraDaJaquetaAmarela.png"
                alt="Homem de jaqueta amarela"
                width={486}
                height={563}
                className="imagem-principal"
              />
              <div className="gradient-bg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
