"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)]"
      aria-label="Rodapé com informações institucionais, redes sociais e newsletter"
    >
      {/* AVISO IMPORTANTE */}
      <div className="bg-white" role="note" aria-label="Aviso sobre saúde mental">
        <p className="text-[#464444] text-center text-sm p-2 font-poppins font-medium pb-3 mb-1">
          Atenção: Este site não oferece tratamento ou aconselhamento imediato
          para pessoas em crise suicida. Ligue 188 (CVV) ou acesse{" "}
          <a
            href="https://www.cvv.org.br"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#338DEF] focus:outline-none focus:ring-2 focus:ring-white"
          >
            www.cvv.org.br
          </a>
          .
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 pb-4 pt-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-6 gap-5">

          {/* LOGO + ÍCONES */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <Image
              className="object-contain"
              alt="Logo da BrailleWay"
              src="/logos/logobrailleway.png"
              width={200}
              height={80}
              priority
            />

            <nav aria-label="Redes sociais">
              <ul className="flex gap-3">
                {[
                  {
                    href: "https://www.linkedin.com/company/brailleway/",
                    bg: "#1C71E4",
                    icon: "/icons/Linkedin.png",
                    alt: "LinkedIn da BrailleWay",
                  },
                  {
                    href: "https://www.instagram.com/_brailleway/",
                    bg: "#4090EC",
                    icon: "/icons/Instagram.png",
                    alt: "Instagram da BrailleWay",
                  },
                  {
                    href: "https://github.com/BrailleWay",
                    bg: "#1C71E4",
                    icon: "/icons/GitHub.png",
                    alt: "GitHub da BrailleWay",
                  },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Abrir ${item.alt} em nova aba`}
                      className="w-9 h-9 flex items-center justify-center rounded-full hover:brightness-110 transition shadow-md"
                      style={{ backgroundColor: item.bg }}
                    >
                      <Image
                        src={item.icon}
                        alt={item.alt}
                        width={20}
                        height={20}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* LINKS */}
          <nav
            className="flex justify-center sm:justify-start gap-15"
            aria-label="Navegação institucional"
          >
            <div className="text-white space-y-1.5">
              <p className="font-poppins font-semibold text-lg">Empresas</p>
              <a className="block cursor-pointer hover:opacity-80" href="#">
                Sobre
              </a>
              <a className="block cursor-pointer hover:opacity-80" href="#">
                Termos de uso
              </a>
              <a className="block cursor-pointer hover:opacity-80" href="#">
                Responsáveis Técnicos
              </a>
            </div>
            <div className="text-white space-y-1.5">
              <p className="font-poppins font-semibold text-lg">Fale conosco</p>
              <a className="block cursor-pointer hover:opacity-80" href="#">
                Contato
              </a>
              <a className="block cursor-pointer hover:opacity-80" href="#">
                Dúvidas
              </a>
              <a className="block cursor-pointer hover:opacity-80" href="#">
                Parcerias
              </a>
            </div>
          </nav>

          {/* NEWSLETTER */}
          <div className="flex flex-col gap-3 w-full sm:w-[340px]">
            <p className="text-white text-center sm:text-start text-lg">
              Esteja por dentro das{" "}
              <span className="font-poppins font-semibold">novidades</span>
            </p>
            <form
              className="relative flex flex-col gap-2"
              aria-label="Formulário para assinar novidades"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="email-newsletter" className="sr-only">
                Digite seu e-mail para se inscrever
              </label>
              <input
                id="email-newsletter"
                name="email"
                type="email"
                className="bg-white rounded-full px-5 py-2.5 text-base text-gray-700 placeholder-gray-500 focus:outline-none w-full"
                placeholder="Seu E-Mail"
                required
                aria-required="true"
              />
              <input
                type="submit"
                value="Me Inscrever"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white font-inter font-semibold bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4,_#44D7D1)] rounded-full px-4 py-2 shadow-md hover:brightness-110 transition cursor-pointer text-sm"
                aria-label="Enviar inscrição"
              />
            </form>
          </div>
        </div>

        {/* LINHA DIVISÓRIA */}
        <div className="w-full h-[1px] bg-white opacity-30 my-4" role="separator"></div>

        {/* COPYRIGHT */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-white mt-2 gap-2 text-xs sm:text-sm">
          <p>
           © 2025 BrailleWay.{" "}
            <span className="font-inter font-medium">Todos os direitos reservados.</span>
          </p>
          <a className="cursor-pointer hover:opacity-80" href="#">
            Políticas
          </a>
        </div>
      </div>
    </footer>
  );
}
