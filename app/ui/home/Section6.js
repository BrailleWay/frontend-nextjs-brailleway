"use client";
import Button from "../../../components/Button";
import AudioButton from "../../../components/AudioButton";
import AudioPlayer from "../../../components/AudioButton copy";

export const Section6 = () => {
    return (
        <div className="w-full bg-white px-4 py-10">

            {/* CONTAINER FLEX */}
            <div className="flex flex-col sm:flex-row-reverse sm:items-center w-full">

                {/* IMAGEM */}
                <div className="flex-shrink-0 w-full sm:w-auto">

                    {/* IMG MOBILE */}
                    <div className="block sm:hidden w-full mb-6">
                        <img
                            className="w-[250px] mx-auto"
                            src="/imgHome/FoneMobile.png"
                            alt="Imagem Mobile"
                        />
                    </div>

                    {/* IMG DESKTOP */}
                    <div className="hidden sm:flex w-full justify-end">
                        <img
                            className="w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] max-w-none object-contain"
                            src="/imgHome/FoneDeOuvido.png"
                            alt="Fone de Ouvido"
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
                        /* 🔥 Margem à esquerda apenas no desktop (a partir de lg = 1024px) */
                    "
                >

                    {/* TÍTULOS */}
                    <div className="font-poppins text-[#343434] text-2xl md:text-3xl lg:text-[32px] leading-tight mb-20">
                        Precisa Relaxar? Ouvir um som relaxante? <br />
                        <span className="text-[#4BA8FF] font-regular">
                            Entre em nossa sala e relaxe!
                        </span>
                    </div>

                    {/* BLOCOS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                desc: "Esse som confirma que você escolheu uma estrela.",
                                player: false,
                            },
                            {
                                title: "Som ao escolher uma estrela",
                                desc: "Esse som confirma que você escolheu uma estrela.",
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
                                } ${item.text || "text-[#343434]"} relative p-6 min-h-[240px]`}
                            >
                                <div className="text-2xl font-medium mb-2">
                                    {item.title}
                                </div>
                                <p
                                    className="font-light text-lg mb-4"
                                    style={{
                                        color:
                                            item.text === "text-white"
                                                ? "#fff"
                                                : "#5a5a5a", // descrição cinza escuro
                                    }}
                                >
                                    {item.desc}
                                </p>
                                {item.player ? (
                                    <AudioPlayer src={item.src} />
                                ) : (
                                    <AudioButton
                                        src={item.src}
                                        buttonClassName="w-[60px] h-[60px]"
                                        imgClassName="w-8 h-8"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* BOTÃO */}
                    <div className="mt-10">
                        <Button>Ouça mais</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section6;
