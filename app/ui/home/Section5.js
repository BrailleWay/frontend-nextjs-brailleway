{/*import amarelaEPretaEstDioDeDesignModernoGuiaDeMarcaApresentaO71 from "./amarela-e-preta-est-dio-de-design-moderno-guia-de-marca-apresenta-o-7-1.png";*/}
import FotoEquipes from "../../../public/fotos/Foto Equipe.png";
{/*import instagramPostFarmCiaSimplesVerdeEBranco51 from "./"; */}
import Pessoa from "../../../public/imgHome/Pessoa fundo amarelo e mão apontado cabelos pretos.png";

export const Section5 = () => {
  return (
    <div className="w-full flex justify-center items-center py-8 bg-white">
      <div className="w-[1257px] h-[545px] flex flex-col items-center justify-center relative">
        {/* Título sobreposto */}
        <p className="font-medium text-transparent text-5xl leading-[67.2px] font-inter text-center mb-4">
          <span className="text-[#333333]">Transformando vidas </span>
          <span className="text-[#1c71e4]">por meio do cuidado</span>
        </p>
        {/* Bloco principal */}
        <div className="flex flex-row items-center justify-center w-full gap-12">
          {/* Card Quem Somos */}
          <div className="w-[722px] h-[289px] rounded-[15px] overflow-hidden border border-solid border-[#f1f1f1] flex items-center relative bg-white">
            <img
              className="w-[278px] h-[201px] object-cover ml-4 rounded-lg"
              alt="Imagem"
              src="/fotos/Foto Equipe.png"
            />
            <div className="flex flex-col items-start gap-4 ml-8">
              <div className="font-medium text-[#222222] text-[40px] leading-[56px] font-poppins">
                Quem Somos
              </div>
              <p className="font-medium text-neutral-800 text-base leading-[25.6px] font-poppins w-[354px]">
                O BrailleWay promove o bem-estar psicológico para todos, com foco
                especial na inclusão de pessoas com deficiência visual, oferecendo
                uma plataforma acessível, privativa e fácil de usar.
              </p>
            </div>
          </div>
          {/* Imagem Pessoa */}
          <div className="relative w-[459px] h-[397px] flex items-end justify-center">
            <div className="absolute w-[419px] h-[136px] bottom-0 left-1/2 -translate-x-1/2 rounded-[25px] blur-[32px] bg-gradient-to-b from-[rgba(75,168,255,0.7)] to-[rgba(68,215,209,0.7)]" />
            <img
              className="w-[459px] h-[377px] object-cover relative z-10"
              alt="Rectangle"
              src={Pessoa}
            />
          </div>
        </div>
        {/* SOBRE NÓS */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="relative w-fit font-medium text-[#0c0c0c] text-base tracking-[1.92px] leading-4 whitespace-nowrap font-poppins">
            SOBRE NÓS
          </div>
        </div>
      </div>
    </div>
  );
};
export default Section5;