
import FotoEquipes from "../../../public/fotos/Foto Equipe.png";
import  PessoaAmarela from "../../../public/imgHome/PessoaFundoAzuleVerde.png";

export const Section5 = () => {
  return (
    <div className="w-full flex justify-center items-center py-8 bg-white">
      <div className="w-[1257px] h-[545px] flex flex-col  justify-center relative">
        {/* Título sobreposto */}
        <p className="font-medium text-transparent text-5xl text-[32px]   leading-[57.2px] font-inter text-left mb-0">
          <span className=" text-[#333333]">Transformando vidas </span>
          <span className=" font-semibold text-[#2e91ed]"> por <br/> meio do cuidado</span>
        </p>
        {/* Bloco principal */}
        <div className="flex flex-row items-center justify-center w-full gap-12">
          {/* Card Quem Somos */}
          <div className="w-[722px] h-[289px] rounded-[15px] overflow-hidden border border-solid border-[#ffffff] flex items-center relative bg-white">
            <img
              className="w-[700px] h-[226px] object-cover ml-0 rounded-lg"
              alt="Imagem"
              src="/fotos/Foto Equipe.png"
            />
            <div className="flex flex-col  gap-2 ml-6">
              <div className="font-semibold text-[#222222] text-[30px] leading-[70px] font-poppins">
                Quem Somos
              </div>
              <p className="font-medium text-neutral-800 text-base leading-[28.6px] font-poppins w-[354px]">
                O BrailleWay promove o bem-estar psicológico para todos, com foco
                especial na inclusão de pessoas com deficiência visual, oferecendo
                uma plataforma acessível, privativa e fácil de usar.
              </p>
            </div>
          </div>
          {/* Imagem Pessoa */}
          <div className="relative w-[456px] h-[370px] flex items-end justify-center">
            <div />
            <img
              className="w-[600px] h-[407px] object-cover relative z-2"
              alt="Rectangle"
              src="imgHome/PessoaFundoAzuleVerde.png"
            />
          </div>
        </div>
        {/* SOBRE NÓS */}
        <div className="absolute top-0 left-2 -translate-x-2 flex items-center gap-2">
          <div className="relative w-fit font-medium text-[#0c0c0c] text-base tracking-[1.92px] leading-4 whitespace-nowrap font-poppins">
            SOBRE NÓS
          </div>
        </div>
      </div>
    </div>
  );
};
export default Section5;