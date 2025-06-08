"use client";
import { useRef, useState } from "react";

import Button from "../components/Button";
import AudioButton from "../../ui/components/AudioButton"; // ajuste o caminho se necessário


export const Section6 = () => {
    // Exemplo para um bloco, repita para outros se quiser
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (!isPlaying) {
            audioRef.current.play();
            setIsPlaying(true);
        } else {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    return (
        <div className="relative w-[1503px] h-[1382px] bg-white left-[505px] top-[-130px]">
            {/* TÍTULO NO TOPO */}
            <div className="absolute top-[210px] left-[86px] font-medium text-[#1c1c1c] text-[32px] tracking-[0] leading-[normal] z-100">
                Precisa Relaxar? Ouvir um som relaxante? <br />
                <span className="text-[#cb6ce6] font-semibold" > Entre em nossa sala e relaxe!</span>  <br />
            </div>
            {/* CONTEÚDO PRINCIPAL */}
            <div className="absolute w-[1357px] h-[1094px] top-72 left-[83px]">
                <div className="absolute w-[1311px] h-[1094px] top-0 left-[46px]">
                    <div className="flex flex-wrap w-[942px] items-start gap-[24px_24px] absolute top-[55px] left-0">

                        {/* Bloco 1 */}
                        <div className="relative w-[364px] h-[296px] rounded-[15px] overflow-hidden bg-gradient-roxo ">
                            <div className="inline-flex flex-col items-start gap-3.5 absolute top-[122px] left-10">
                                <div className="relative w-[328px] mt-[-1.00px] font-medium text-[#ffffff] text-2xl leading-[33.6px]">
                                    O som mais importante
                                </div>
                                <p className="relative w-[284px] font-normal text-[#ffffff] text-sm leading-[22.4px]">
                                    Ele acalma, relaxa e alivia faz se sentir seguro. <br />
                                    Feche os olhos e permita-se sentir... <br />
                                    Essa sensação é o Braille Way.
                                </p>
                            </div>
                            <div className="absolute w-[284px] top-[47px] left-[107px] font-semibold text-[#ffffff] text-2xl leading-[33.6px]">
                                Áudio Principal
                            </div>
                            {/* Botão de áudio funcional */}
                            <AudioButton src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3" />
                        </div>

                        {/* Bloco 2 */}
                        <div className="relative w-[364px] h-[296px] bg-light-gray-2 rounded-[15px] overflow-hidden">
                            <div className="inline-flex flex-col items-start gap-3.5 absolute top-[122px] left-10">
                                <p className="relative w-[284px] mt-[-1.00px] font-medium text-primary text-2xl leading-[33.6px]">
                                    Som ao escolher uma estrela na avaliação
                                </p>
                                <p className="relative w-[284px] font-semibold text-[#212020] text-sm leading-[22.4px]">
                                    Esse som confirma que você escolheu uma estrela.
                                </p>
                            </div>
                            <div className="absolute w-[50px] h-20 top-[29px] left-10">
                            </div>


                            <div className="absolute w-[50px] h-[50px] top-10 left-10 bg-[#cb6ce6] rounded-[99px] overflow-hidden">
                                <img className="absolute w-[41px] h-7 top-[11px] left-[5px]" alt="Pause" src="/imgHome/Play.png" />
                            </div>

                            {/* Botão de áudio funcional */}
                            <AudioButton src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3" />

                        </div>

                        {/* Bloco 3 */}
                        <div className="relative w-[364px] h-[296px] bg-light-gray-2 rounded-[15px] overflow-hidden">
                            <div className="absolute w-[284px] h-[233px] top-7 left-[31px]">
                                <div className="h-[154px] top-[79px] left-0 inline-flex flex-col items-start gap-3.5 absolute">
                                    <p className="relative w-[284px] mt-[-1.00px] font-medium text-primary text-2xl leading-[33.6px]">
                                        Som de sucesso ao envio
                                    </p>
                                    <p className="relative w-[284px] mb-[-15.00px] font-normal text-text text-sm leading-[22.4px]">
                                        Esse som acontece quando você envia algo, como um comentário, um cadastro ou avaliação. Ele confirma que o seu envio foi realizado.
                                    </p>

                                </div>
                            </div>

                            <div className="absolute w-[50px] h-[50px] top-10 left-10 bg-[#cb6ce6] rounded-[99px] overflow-hidden">
                                <img className="absolute w-[41px] h-7 top-[11px] left-[5px]" alt="Pause" src="/imgHome/Play.png" />
                            </div>
                            {/* Botão de áudio funcional */}
                            <AudioButton src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3" />
                        </div>




                        <div className="absolute w-[50px] h-[50px] top-10 left-10 bg-[#ffffff] rounded-[99px] overflow-hidden">
                            <img className="absolute w-[41px] h-7 top-[11px] left-[5px]" alt="Pause" src="/imgHome/Play.png" />
                        </div>

                        {/* Bloco 4 - Aviso */}
                        <div className="relative w-[364px] h-[296px] bg-light-gray-2 rounded-[15px] overflow-hidden">
                            <div className="inline-flex flex-col items-start gap-3.5 absolute top-[122px] left-10">
                                <div className="relative w-[284px] mt-[-1.00px] font-medium text-primary text-2xl leading-[33.6px]">
                                    Som de Aviso
                                </div>
                                <p className="relative w-[284px] font-normal text-text text-sm leading-[22.4px]">
                                    Avisar sobre interrupções importantes, como um novo comentário, notificação ou alerta.
                                </p>
                            </div>


                            <div className="absolute w-[50px] h-20 top-[18px] left-7">
                            </div>

                            <div className="absolute w-[50px] h-[50px] top-10 left-10 bg-[#cb6ce6] rounded-[99px] overflow-hidden">
                                <img className="absolute w-[41px] h-7 top-[11px] left-[5px]" alt="Pause" src="/imgHome/Play.png" />
                            </div>
                            {/* Botão de áudio funcional */}
                            <AudioButton src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3" />
                        </div>

                        {/* Bloco 5 - Voz de Guia Acolhedora */}
                        <div className="relative w-[364px] h-[296px] bg-light-gray-2 rounded-[15px] overflow-hidden">
                            <div className="top-[97px] left-8 inline-flex flex-col items-start gap-3.5 absolute">
                                <div className="relative w-[284px] mt-[-1.00px] font-medium text-primary text-2xl leading-[33.6px]">
                                    Voz de Guia Acolhedora
                                </div>
                                <p className="relative w-[284px] font-normal text-text text-sm leading-[22.4px]">
                                    Essa voz feminina suave vai te acompanhar durante toda a navegação. Deixando você tranquilo e seguro.
                                </p>
                            </div>
                            <div className="absolute w-[50px] h-20 top-3.5 left-8"></div>
                            <div className="absolute w-[50px] h-[50px] top-10 left-10 bg-[#cb6ce6] rounded-[99px] overflow-hidden">
                                <img className="absolute w-[41px] h-7 top-[11px] left-[5px]" alt="Pause" src="/imgHome/Play.png" />
                            </div>
                            {/* Botão de áudio funcional */}
                            <AudioButton src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3" />
                        </div>

                        {/* Bloco 6 - Voz de Guia Masculina */}
                        <div className="relative w-[364px] h-[296px] bg-light-gray-2 rounded-[15px] overflow-hidden">
                            <div className="top-[97px] left-8 inline-flex flex-col items-start gap-3.5 absolute">
                                <div className="relative w-[284px] mt-[-1.00px] font-medium text-primary text-2xl leading-[33.6px]">
                                    Voz de Guia Masculina
                                </div>
                                <p className="relative w-[284px] font-normal text-text text-sm leading-[22.4px]">
                                    Esta voz masculina transmite confiança e clareza durante a navegação, tornando sua experiência ainda mais confortável.
                                </p>
                            </div>
                            <div className="absolute w-[50px] h-20 top-3.5 left-8"></div>
                            <div className="absolute w-[50px] h-[50px] top-10 left-10 bg-[#cb6ce6] rounded-[99px] overflow-hidden">
                                <img className="absolute w-[41px] h-7 top-[11px] left-[5px]" alt="Pause" src="/imgHome/Play.png" />
                            </div>
                            {/* Botão de áudio funcional */}
                            <AudioButton src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3" />
                        </div>

                        <p> </p>
                        <p></p>
                        {/* BOTÃO */}
                       <div style={{fontWeight: 400, fontFamily: 'inter, sans-serif' }}>
  <Button>Ouça mais</Button>
</div>

                    </div>



                    <img className="absolute w-[1200px] h-[1300px] top-0 left-[700px] quality={100}object-cover" alt="Image" src="/imgHome/FoneDeOuvido.png" />
                </div>
            </div>

        </div>


    );
};
export default Section6;