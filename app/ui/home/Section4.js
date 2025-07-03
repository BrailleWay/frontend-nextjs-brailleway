import React from "react";
import Image from "next/image";

export default function PsychologistSection() {
  const psychologists = [
    {
      name: "Julian Jameson",
      rating: 4.8,
      profession: "Obstetra",
      public: "Crianças e Adolescentes",
      tags: ["Ansiedade", "TDAH", "Depressão"],
      image: "/home/Imagem Medico.webp",
      alt: "Foto do Dr. Julian Jameson, obstetra especializado em crianças e adolescentes",
    },
    {
      name: "Maria Souza",
      rating: 4.9,
      profession: "Psiquiatra",
      public: "Adultos e Idosos",
      tags: ["Ansiedade", "Autismo", "Depressão"],
      image: "/home/Imagem Psicologo codigo.webp",
      alt: "Foto da Dra. Maria Souza, psiquiatra especializada em adultos e idosos",
    },
  ];

  return (
    <section
      className="py-22 px-6 bg-white max-w-7xl mx-auto"
      aria-labelledby="profissionais-titulo"
    >
      <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
        
        {/* TEXTO LATERAL */}
        <div className="max-w-md flex-shrink-0">
          <h2
            id="profissionais-titulo"
            className="text-4xl font-inter text-[#343434] mb-4"
          >
            Ache seu{" "}
            <span className="text-[#1C71E4] font-semibold">
              profissional ideal
            </span>
          </h2>
          <p className="text-[#232323] mb-6 text-1xl text-justify font-poppins">
            Encontre o especialista perfeito para você! Avaliar o atendimento nos ajuda a garantir a qualidade dos serviços de telemedicina e construir uma rede cada vez mais acolhedora e eficiente em áreas oferecidas pela Braille Way no serviço de Telemedicina.
          </p>
          <button
            className="font-poppins font-medium rounded-full text-white px-8 py-4 text-l md:text-l mt-4 bg-gradient-to-r from-[#4090EC] via-[#1C71E4] to-[#44D7D1] w-fit ml-auto shadow-[0_4px_16px_-2px_rgba(0,0,0,0.18)] transition duration-200 hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.28)] hover:scale-105 active:scale-100 cursor-pointer justify-center"
            aria-label="Acessar a lista completa de especialistas"
          >
            Ache seu especialista
          </button>
        </div>

        {/* CARDS DE PROFISSIONAIS */}
        <div className="flex flex-wrap gap-6 justify-center" role="list">
          {psychologists.map((psych, index) => (
            <article
              key={index}
              role="listitem"
              className="bg-white shadow-md rounded-2xl overflow-hidden w-72 flex flex-col"
              aria-label={`Cartão da profissional ${psych.name}`}
            >
              {/* FOTO */}
              <div className="h-44 w-full bg-gray-100 relative">
                <Image
                  src={psych.image}
                  alt={psych.alt}
                  fill
                  className="object-cover"
                />
              </div>

              {/* CONTEÚDO */}
              <div className="p-5 flex flex-col gap-2">
                <h3 className="font-semibold font-poppins text-[#343434] text-lg">
                  {psych.name}
                </h3>

                <p className="text-sm text-[#5a5a5a] font-inter">
                  {psych.profession}
                </p>

                <div className="flex items-center gap-1 text-yellow-500 text-sm font-poppins font-medium" aria-label={`Nota ${psych.rating} de 5`}>
                  ★ {psych.rating}
                </div>

                <p className="text-xs text-[#5a5a5a] mt-1 font-inter">
                  Público: {psych.public}
                </p>

                <div className="flex flex-wrap gap-2 mt-2" aria-label="Áreas de atuação">
                  {psych.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="border font-inter border-[#1C71E4] text-[#1C71E4] text-xs px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* BOTÃO */}
                <button
                  className="mt-4 font-poppins font-medium bg-gradient-to-r from-[#4090EC] via-[#1C71E4] to-[#44D7D1] hover:brightness-110 text-white w-full py-2 px-2 rounded-full text-sm transition cursor-pointer"
                  aria-label={`Conectar com ${psych.name}`}
                >
                  Conectar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
