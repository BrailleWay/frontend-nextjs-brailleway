"use client";
import Button from "../components/Button";
import AudioButton from "../../ui/components/AudioButton";

export const Section6 = () => {
    return (
        <div className="relative w-[1100px] h-[950px] bg-white left-[200px] top-[-40px]">
            {/* TÍTULO NO TOPO */}
            <div className="absolute top-[100px] left-[40px] font-medium text-[#1c1c1c] text-[24px] leading-tight z-100">
                Precisa Relaxar? Ouvir um som relaxante? <br />
                <span className="text-[#cb6ce6] font-semibold"> Entre em nossa sala e relaxe!</span>
            </div>
            {/* CONTEÚDO PRINCIPAL */}
            <div className="absolute w-[950px] h-[800px] top-48 left-[40px]">
                <div className="absolute w-[930px] h-[800px] top-0 left-0">
                    <div className="flex flex-wrap w-[750px] items-start gap-6 absolute top-14 left-0">
                        {/* Bloco 1 */}
                        <div className="relative w-[260px] h-[200px] rounded-[14px] overflow-hidden bg-gradient-roxo">
                            <div className="inline-flex flex-col items-start gap-3 absolute top-[80px] left-6">
                                <div className="relative w-[200px] font-medium text-[#fff] text-lg leading-tight">
                                    O som mais importante
                                </div>
                                <p className="relative w-[180px] font-normal text-[#fff] text-sm leading-tight">
                                    Ele acalma, relaxa e alivia faz se sentir seguro.<br />
                                    Feche os olhos e permita-se sentir...<br />
                                   
                                </p>
                            </div>
                            <div className="absolute w-[150px] top-[30px] left-[80px] font-semibold text-[#fff] text-lg leading-tight">
                                Áudio Principal
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[44px] h-[44px] top-4 left-4"
                                imgClassName="w-[22px] h-6"
                            />
                        </div>
                        {/* Bloco 2 */}
                        <div className="relative w-[260px] h-[200px] bg-light-gray-2 rounded-[14px] overflow-hidden">
                            <div className="inline-flex flex-col items-start gap-3 absolute top-[80px] left-6 ">
                             
                                <p className="relative w-[180px] font-medium text-primary text-lg leading-tight">
                                    Som ao escolher uma estrela
                                </p>
                                <p className="relative w-[180px] font-semibold text-[#212020] text-sm leading-tight">
                                    Esse som confirma que você escolheu uma estrela.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[44px] h-[44px] top-4 left-4"
                                imgClassName="w-[22px] h-6"
                            />
                        </div>

                        {/* Bloco 3 */}
                        <div className="relative w-[260px] h-[200px] bg-light-gray-2 rounded-[14px] overflow-hidden">
                            <div className="inline-flex flex-col items-start gap-3 absolute top-[80px] left-6 ">
                             
                                <p className="relative w-[180px] font-medium text-primary text-lg leading-tight">
                                    Som ao escolher uma estrela
                                </p>
                                <p className="relative w-[180px] font-semibold text-[#212020] text-sm leading-tight">
                                    Esse som confirma que você escolheu uma estrela.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[44px] h-[44px] top-4 left-4"
                                imgClassName="w-[22px] h-6"
                            />
                        </div>

                        {/* Bloco 4 */}
                        <div className="relative w-[260px] h-[200px] bg-light-gray-2 rounded-[14px] overflow-hidden">
                            <div className="inline-flex flex-col items-start gap-3 absolute top-[80px] left-6">
                                <div className="font-medium text-primary text-lg leading-tight">
                                    Som de Aviso
                                </div>
                                <p className="font-normal text-text text-sm leading-tight">
                                    Avisar sobre interrupções importantes, como um novo comentário, notificação ou alerta.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[44px] h-[44px] top-4 left-4"
                                imgClassName="w-[22px] h-6"
                            />
                        </div>
                        {/* Bloco 5 */}
                        <div className="relative w-[260px] h-[200px] bg-light-gray-2 rounded-[14px] overflow-hidden">
                            <div className="inline-flex flex-col items-start gap-3 absolute top-[80px] left-6">
                                <div className="font-medium text-primary text-lg leading-tight">
                                    Voz de Guia Acolhedora
                                </div>
                                <p className="font-normal text-text text-sm leading-tight">
                                    Essa voz feminina suave vai te acompanhar durante toda a navegação.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[44px] h-[44px] top-4 left-4"
                                imgClassName="w-[22px] h-6"
                            />
                        </div>
                        {/* Bloco 6 */}
                        <div className="relative w-[260px] h-[200px] bg-light-gray-2 rounded-[14px] overflow-hidden">
                            <div className="inline-flex flex-col items-start gap-3 absolute top-[80px] left-6">
                                <div className="font-medium text-primary text-lg leading-tight">
                                    Voz de Guia Masculina
                                </div>
                                <p className="font-normal text-text text-sm leading-tight">
                                    Esta voz masculina transmite confiança e clareza durante a navegação.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[44px] h-[44px] top-4 left-4"
                                imgClassName="w-[22px] h-6"
                            />
                        </div>


                        <p></p>
                        <p></p>
                        {/* BOTÃO */}
                        <div style={{ fontWeight: 400, fontFamily: 'inter, sans-serif', marginTop: 24 }}>
                            <Button>Ouça mais</Button>
                        </div>
                    </div>
                    <img
                        className="absolute w-[800px] h-[780px] top-0 left-[800px] object-cover"
                        alt="Image"
                        src="/imgHome/FoneDeOuvido.png"
                    />
                </div>
            </div>
        </div>
    );
};
export default Section6;