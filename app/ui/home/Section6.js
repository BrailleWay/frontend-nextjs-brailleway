"use client";
import Button from "../../../components/Button";
import AudioButton from "../../../components/AudioButton";
import AutoPlayAudio from "../../../components/AudioButton copy";

export const Section6 = () => {
    return (
        <div className="relative w-[1300px] h-[1150px] bg-white left-[100px] top-[-20px]">
            {/* TÍTULO NO TOPO */}
            <div className=" font-inter absolute top-[120px] left-[60px] font-normal text-[#1c1c1c] text-[32px] leading-tight z-100">
                Precisa Relaxar? Ouvir um som relaxante? <br />
                <span className="text-[#cb6ce6] font-semibold"> Entre em nossa sala e relaxe!</span>
            </div>
            {/* CONTEÚDO PRINCIPAL */}
            <div className="font-poppins absolute w-[1150px] h-[1000px] top-56 left-[60px]">
                <div className="absolute w-[1130px] h-[1000px] top-0 left-0">
                    <div className="flex flex-wrap w-[950px] items-start gap-10 absolute top-20 left-0">
                        {/* Bloco 1 */}
                        <div className="relative w-[320px] h-[260px] rounded-[20px] overflow-hidden bg-gradient-roxo">
                            <div className="inline-flex flex-col items-start gap-5 absolute top-[110px] left-8">
                                <div className="relative w-[250px] font-medium text-[#fff] text-2xl leading-tight">
                                    O som mais importante
                                </div>
                                <p className="relative w-[220px] font-light text-[#fff] text-lg leading-tight">
                                    Ele acalma, relaxa e alivia faz se sentir seguro.<br />
                                    Feche os olhos<br />
                                   
                                </p>
                            </div>
                            <div className="absolute w-[200px] top-[40px] left-[110px] font-semibold text-[#fff] text-2xl leading-tight">
                                Áudio Principal
                            </div>



                            <AutoPlayAudio
                                src="/audios/432 hz FREQUÊNCIA PARA EXPANDIR A CONSCIÊNCIA  Elevar a Vibração, Meditação Profunda, Paz (mp3cut.net).mp3"
                                buttonClassName="w-[60px] h-[60px] top-6 left-6"
                                imgClassName="w-[32px] h-8"
                              
                           
                               
                            />
                        </div>
                        {/* Bloco 2 */}
                        <div className="relative w-[320px] h-[260px] bg-light-gray-2 rounded-[20px] overflow-hidden bg-[#F8F8F8]">
                            <div className="inline-flex flex-col items-start gap-5 absolute top-[110px] left-8">
                                <p className="relative w-[220px] font-normal text-primary text-2xl leading-tight">
                                    Som ao escolher uma estrela
                                </p>
                                <p className="relative w-[220px] font-light text-[#212020] text-lg leading-tight">
                                    Esse som confirma que você escolheu uma estrela.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[60px] h-[60px] top-6 left-6"
                                imgClassName="w-[32px] h-8"
                            />
                        </div>
                        {/* Bloco 3 */}
                        <div className="relative w-[320px] h-[260px] bg-light-gray-2 rounded-[20px] overflow-hidden bg-[#F8F8F8]">
                            <div className="inline-flex flex-col items-start gap-5 absolute top-[110px] left-8">
                                <p className="relative w-[220px] font-normal text-primary text-2xl leading-tight">
                                    Som ao escolher uma estrela
                                </p>
                                <p className="relative w-[220px] font-light text-[#212020] text-lg leading-tight">
                                    Esse som confirma que você escolheu uma estrela.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[60px] h-[60px] top-6 left-6"
                                imgClassName="w-[32px] h-8"
                            />
                        </div>
                        {/* Bloco 4 */}
                        <div className="relative w-[320px] h-[260px] bg-light-gray-2 rounded-[20px] overflow-hidden bg-[#F8F8F8]">
                            <div className="inline-flex flex-col items-start gap-5 absolute top-[110px] left-8">
                                <div className="font-medium text-primary text-2xl leading-tight">
                                    Som de Aviso
                                </div>
                                <p className="font-light text-text text-lg leading-tight">
                                    Avisar sobre interrupções importantes, como um novo comentário, notificação ou alerta.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[60px] h-[60px] top-6 left-6"
                                imgClassName="w-[32px] h-8"
                            />
                        </div>
                        {/* Bloco 5 */}
                        <div className="relative w-[320px] h-[260px] bg-light-gray-2 rounded-[20px] overflow-hidden bg-[#F8F8F8]">
                            <div className="inline-flex flex-col items-start gap-5 absolute top-[110px] left-8">
                                <div className="font-medium text-primary text-2xl leading-tight">
                                    Voz de Guia Acolhedora
                                </div>
                                <p className="font-light text-text text-lg leading-tight">
                                    Essa voz feminina suave vai te acompanhar durante toda a navegação.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[60px] h-[60px] top-6 left-6"
                                imgClassName="w-[32px] h-8"
                            />
                        </div>
                        {/* Bloco 6 */}
                        <div className="relative w-[320px] h-[260px] bg-light-gray-2 rounded-[20px] overflow-hidden bg-[#F8F8F8]">
                            <div className="inline-flex flex-col items-start gap-5 absolute top-[110px] left-8">
                                <div className="font-medium text-primary text-2xl leading-tight">
                                    Voz de Guia Masculina
                                </div>
                                <p className="font-light text-text text-lg leading-tight">
                                    Esta voz feminina transmite confiança e clareza durante a navegação.
                                </p>
                            </div>
                            <AudioButton
                                src="/audios/Black Green Modern Playful Abstract Marketing Proposal Presentation (3) (audio-extractor.net).mp3"
                                buttonClassName="w-[60px] h-[60px] top-6 left-6"
                                imgClassName="w-[32px] h-8"
                            />
                        </div>
                        <p></p>
                         <p></p> <p></p>
                        {/* BOTÃO */}
                        <div style={{ fontWeight: 400, fontFamily: 'inter, sans-serif', marginTop: 32 }}>
                            <Button >Ouça mais</Button>
                        </div>
                    </div>
                 {   /* <img
                        className="absolute w-[950] h-[950px] top-10 left-[800px] object-cover"
                        alt="Image"
                        src="/imgHome/FoneDeOuvido.png"
                    />*/}
                </div>
            </div>
        </div>
    );
};
export default Section6;