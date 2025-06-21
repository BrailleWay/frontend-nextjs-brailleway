import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)]">
      {/* AVISO IMPORTANTE */}
      <div className="bg-white">
        <p className="text-[#464444] text-center text-sm p-2 font-['poppins-medium']">
          Atenção: Este site não oferece tratamento ou aconselhamento imediato
          para pessoas em crise suicida. Em caso de crise, ligue para 188 (CVV)
          ou acesse o site www.cvv.org.br. Em caso de emergência, procure
          atendimento em um hospital mais próximo.
        </p>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-12 gap-10">

          {/* LOGO + ÍCONES */}
          <div className="flex flex-col items-center sm:items-start gap-0">
            {/* LOGO MAIS PRA CIMA */}
            <Image
              className="object-contain"
              alt="Logo"
              src="/logos/logobrailleway.png"
              width={250}
              height={100}
            />

            {/* ÍCONES SOCIAIS MAIS PRA BAIXO */}
            <div className="flex gap-3 mt-2">
              {[
                {
                  href: "#",
                  bg: "#1C71E4",
                  icon: "/icons/Linkedin.png",
                  alt: "LinkedIn",
                },
                {
                  href: "#",
                  bg: "#4090EC",
                  icon: "/icons/Instagram.png",
                  alt: "Instagram",
                },
                {
                  href: "#",
                  bg: "#1C71E4",
                  icon: "/icons/GitHub.png",
                  alt: "GitHub",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[${item.bg}] p-3 rounded-full hover:brightness-110 transition`}
                >
                  <Image
                    src={item.icon}
                    alt={item.alt}
                    width={20}
                    height={20}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS EMPRESAS E FALE CONOSCO */}
          <div className="flex justify-center sm:justify-start gap-20">
            <div className="text-white space-y-3">
              <p className="font-['Poppins-semibold'] text-lg">Empresas</p>
              <p className="cursor-pointer text-base hover:opacity-80">Sobre</p>
              <p className="cursor-pointer text-base hover:opacity-80">Termos de uso</p>
              <p className="cursor-pointer text-base hover:opacity-80">Responsáveis Técnicos</p>
            </div>
            <div className="text-white space-y-3">
              <p className="font-['Poppins-semibold'] text-lg">Fale conosco</p>
              <p className="cursor-pointer text-base hover:opacity-80">Contato</p>
              <p className="cursor-pointer text-base hover:opacity-80">Dúvidas</p>
              <p className="cursor-pointer text-base hover:opacity-80">Parcerias</p>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="flex flex-col gap-4 w-full sm:w-[380px]">
            <p className="text-white text-center sm:text-start text-lg">
              Esteja por dentro das{" "}
              <span className="font-['Poppins-semibold']">novidades</span>
            </p>
            <form className="relative flex flex-col gap-3">
              <input
                className="bg-white rounded-full px-6 py-4 text-base text-gray-700 placeholder-gray-500 focus:outline-none w-full"
                type="email"
                placeholder="Seu E-Mail"
              />
              <input
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-['Inter-semibold'] bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4,_#44D7D1)] rounded-full px-5 py-2.5 shadow-md hover:brightness-110 transition cursor-pointer text-sm"
                type="submit"
                value="Me Inscrever"
              />
            </form>
          </div>
        </div>

        {/* LINHA DIVISÓRIA */}
        <div className="w-full h-[1px] bg-white opacity-30 my-6"></div>

        {/* COPYRIGHT */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-white mt-2 gap-2 text-xs sm:text-sm">
          <p>
            Copyright ©{" "}
            <span className="font-['Poppins-medium']">2025 BrailleWay</span>
          </p>
          <p className="cursor-pointer hover:opacity-80">Políticas</p>
        </div>
      </div>
    </footer>
  );
}
