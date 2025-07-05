import Image from "next/image";
import React from "react";
import Button from "@/components/Button";
import "./Section1.css";
import Link from "next/link";

export default function Section1() {
  return (
    <section
      className="container gap-16 md:gap-9 lg:gap-24 2xl:gap-20 mt-20 mb-20 mx-auto flex flex-col-reverse lg:flex-row px-4"
      aria-label="Seção introdutória com imagem, chamada e botão de ação"
    >
      {/* ESQUERDA: IMAGEM + TEXTO + BOTÃO */}
      <div className="relative flex justify-center items-center">
        <Image
          width={1080}
          height={1080}
          src="/home/familia (4).webp"
          alt="Homem sorrindo de perfil à direita com fundo colorido em degradê azul e verde, segurando uma bengala com três listras azuis."
          className="img-vazada"
          priority
          sizes="(max-width: 640px) 75vw, (max-width: 768px) 50vw, 25vw"
          fetchpriority="high"
        />

        {/* Texto alternativo longo acessível apenas para leitores de tela */}
        <span id="desc-imagem" className="sr-only">
          A imagem é composta por um fundo em formato de quadrado com um degradê que começa na borda inferior direita com um tom verde-água claro, transita para um azul vivo no centro e finaliza na parte superior com um azul mais claro e radiante, refletindo as cores da logo. Em frente a esse fundo colorido, há um homem enquadrado do peito para cima. Ele está olhando para a direita, levemente para cima, com uma expressão sorridente. É careca, com sobrancelhas finas e um nariz um pouco mais alongado. Ele veste uma camisa social de botão na cor cinza clara e segura uma bengala preta com três listras azuis. À direita da imagem, há um texto sobre um fundo branco.
        </span>

        <div id="container-esquerda">
          <div className="w-full space-y-4 z-0">
            <h2 className="text-white text-center md:text-left font-inter font-semibold text-4xl md:max-w-sm">
              Ouça nossas<br />frequências
            </h2>
            <p className="text-white text-center md:text-left font-inter text-base md:max-w-sm">
              Teste grátis<br />e tenha acesso <br />a nossos sons <br />para relaxar
            </p>

            <Button
              className="font-inter"
              aria-label="Clique para ouvir agora sons relaxantes"
              style={{
                background: "white",
                color: "#1c1c1c",
                padding: "7px 17px",
                borderRadius: "9999px",
                fontSize: "0.9rem",
                margin: "0rem 0rem",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                position: "relative",
              }}
            >
              Ouça Agora
            </Button>
          </div>
        </div>
      </div>

      {/* DIREITA: TÍTULOS E TEXTO */}
      <div
        id="merece-cuidados"
        className="flex flex-col lg:max-w-2xl px-4"
        aria-labelledby="titulo-saude"
      >
        <h1
          id="titulo-saude"
          className="text-center lg:text-left lg:max-w-xl mb-8 text-4xl md:text-6xl lg:text-7xl font-urbanist font-medium"
        >
          <span className="text-[#343434]">Sua saúde merece </span>
          <span className="font-bold text-[#1C71E4]">cuidados</span>
        </h1>

        <div className="h-0.5 w-full mb-5 bg-black" role="separator" />

        <p className="text-left font-poppins text-base md:text-1xl text-[#343434]">
          Para quem enxerga com o coração e sente com a alma, a{" "}
          <span className="text-[#1C71E4] font-bold">Braille Way</span> abre portas
          para consultas mais humanas, acessíveis e feitas para transformar vidas.
        </p>

        <div className="w-full flex justify-center lg:justify-start">
          <button
            className="
              font-poppins
              rounded-full
              text-white
              px-10
              py-2.5
              text-lg
              md:text-2xl
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
            "
            aria-label="Clique para se cadastrar"
          >
            Cadastre-se
          </button>
        </div>
      </div>
    </section>
  );
}
