"use client";
import Button from "../../../components/Button";
import AudioButton from "../../../components/AudioButton";
import AudioPlayer from "../../../components/AudioButton copy";
import Image from "next/image";

export const Section6 = () => {
  return (
    <div className="w-full bg-white px-4 py-10">
      {/* CONTAINER FLEX */}
      <div className="flex flex-col sm:flex-row-reverse sm:items-center w-full">
        {/* IMAGEM */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          {/* IMG MOBILE */}
          <div className="block sm:hidden w-full mb-6">
            <Image
              className="w-[250px] mx-auto"
              src="/imgHome/FoneMobile.png"
              alt="Imagem Mobile"
              width={1200}
              height={1300}
            />
          </div>

          {/* IMG DESKTOP */}
          <div className="hidden sm:flex w-full justify-end">
            <Image
              className="w-[300px] md:w-[400px] lg:w-[500px] xl:w-[500px] max-w-none object-contain"
              src="/imgHome/FoneDeOuvido.png"
              alt="Fone de Ouvido"
              width={652}
              height={1300}
            />
          </div>
        </div>

        {/* CONTEÚDO CENTRAL */}
        <div
          className="
                        w-full 
                        max-w-[1300px] 
                        mx-auto 
                        lg:ml-24
                    "
        >
          {/* TÍTULOS */}
          <div className="font-poppins text-[#343434] text-2xl md:text-3xl lg:text-[32px] leading-tight mb-16">
            Precisa Relaxar? Que tal ouvir um som Tranquilizador? <br />
            <span className="text-[#4BA8FF] font-regular">
              Entre em nossa sala e relaxe!
            </span>
          </div>

          {/* BLOCOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "Áudio Principal",
                desc: "Ele acalma, relaxa e alivia, faz se sentir seguro. Feche os olhos.",
                player: true,
                src: "/audios/meditacao.mp3",
                bg: "bg-gradient-to-r from-[#4090EC] via-[#1C71E4] to-[#44D7D1]",
                text: "text-white",
              },
              {
                title: "Som ao escolher uma estrela",
                desc: "Esse som confirma que você escolheu uma estrela, usado para a avaliação.",
                player: false,
              },
              {
                title: "Som ao entrar em chamada",
                desc: "Esse som mostra que você entrou em chamada, usado para as sessões entre você e o profissional.",
                player: false,
              },
              {
                title: "Som de Aviso",
                desc: "Avisar sobre interrupções importantes, como um novo comentário, notificação ou alerta.",
                player: false,
              },
              {
                title: "Voz de Guia Acolhedora",
                desc: "Essa voz feminina suave vai te acompanhar durante toda a navegação.",
                player: false,
              },
              {
                title: "Voz de Guia Masculina",
                desc: "Esta voz masculina transmite confiança e clareza durante a navegação.",
                player: false,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`font-poppins rounded-2xl overflow-hidden ${
                  item.bg || "bg-[#F8F8F8]"
                } ${item.text || "text-[#343434]"} relative p-4 min-h-[190px]`}
              >
                <div className="text-xl font-medium mb-2">{item.title}</div>
                <p
                  className="font-light text-base mb-3"
                  style={{
                    color: item.text === "text-white" ? "#fff" : "#5a5a5a",
                  }}
                >
                  {item.desc}
                </p>
                {item.player ? (
                  <AudioPlayer src={item.src} />
                ) : (
                  <AudioButton
                    src={item.src}
                    buttonClassName="w-[50px] h-[50px]"
                    imgClassName="w-6 h-6"
                  />
                )}
              </div>
            ))}
          </div>

          {/* BOTÃO */}
          <div className="mt-8">
            <Button>Ouça mais</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section6;
