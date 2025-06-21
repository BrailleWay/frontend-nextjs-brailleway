"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)]">
      {/* AVISO IMPORTANTE */}
      <div className="bg-white">
        <p className="text-[#464444] text-center text-sm p-2 font-['poppins-medium'] pb-3 mb-1">
          Atenção: Este site não oferece tratamento ou aconselhamento imediato
          para pessoas em crise suicida. Ligue 188 (CVV) ou acesse www.cvv.org.br.
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6 gap-5">

          {/* LOGO + ÍCONES */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <Image
              className="object-contain"
              alt="Logo"
              src="/logos/logobrailleway.png"
              width={200}
              height={80}
            />

            <div className="flex gap-3">
              {[
                { href: "#", bg: "#1C71E4", icon: "/icons/Linkedin.png", alt: "LinkedIn" },
                { href: "#", bg: "#4090EC", icon: "/icons/Instagram.png", alt: "Instagram" },
                { href: "#", bg: "#1C71E4", icon: "/icons/GitHub.png", alt: "GitHub" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-[${item.bg}] p-2 rounded-full hover:brightness-110 transition`}
                >
                  <Image src={item.icon} alt={item.alt} width={18} height={18} />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          <div className="flex justify-center sm:justify-start gap-15">
            <div className="text-white space-y-1.5">
              <p className="font-['Poppins-semibold'] text-lg">Empresas</p>
              <p className="cursor-pointer hover:opacity-80">Sobre</p>
              <p className="cursor-pointer hover:opacity-80">Termos de uso</p>
              <p className="cursor-pointer hover:opacity-80">Responsáveis Técnicos</p>
            </div>
            <div className="text-white space-y-1.5">
              <p className="font-['Poppins-semibold'] text-lg">Fale conosco</p>
              <p className="cursor-pointer hover:opacity-80">Contato</p>
              <p className="cursor-pointer hover:opacity-80">Dúvidas</p>
              <p className="cursor-pointer hover:opacity-80">Parcerias</p>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="flex flex-col gap-3 w-full sm:w-[340px] ">
            <p className="text-white text-center sm:text-start text-lg">
              Esteja por dentro das{" "}
              <span className="font-['Poppins-semibold']">novidades</span>
            </p>
            <form className="relative flex flex-col gap-2">
              <input
                className="bg-white rounded-full px-5 py-2.5 text-base text-gray-700 placeholder-gray-500 focus:outline-none w-full"
                type="email"
                placeholder="Seu E-Mail"
              />
              <input
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-['Inter-semibold'] bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4,_#44D7D1)] rounded-full px-4 py-2 shadow-md hover:brightness-110 transition cursor-pointer text-sm"
                type="submit"
                value="Me Inscrever"
              />
            </form>
          </div>
        </div>

        {/* LINHA DIVISÓRIA */}
        <div className="w-full h-[1px] bg-white opacity-30 my-4"></div>

        {/* COPYRIGHT */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-white mt-2 gap-2 text-xs sm:text-sm">
          <p>
            Copyright © <span className="font-['Poppins-medium']">2025 BrailleWay</span>
          </p>
          <p className="cursor-pointer hover:opacity-80">Políticas</p>
        </div>
      </div>
    </footer>
  );
}
