import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return(
    <footer className="bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)]">
        <div className='bg-white outline text text-black'>
                <p className='text-[#464444] text-center p-2 font-["Inter-medium"]'>Atenção: Este site não oferece tratamento ou aconselhamento imediato para pessoas em crise suicida. Em caso de crise, ligue para 188 (CVV) ou acesse o site www.cvv.org.br. Em caso de emergência, procure atendimento em um hospital mais próximo.</p>
            </div>
        <div className="container p-2 sm:p-0 mx-auto pb-5 sm:pb-0.5 md:p-4 xl:p-0">
            
            <div className="flex flex-col sm:flex-row sm:gap-5">
                <div className="flex flex-col sm:mt-4">
                    <div className="mx-auto bg-white p-5 rounded-2xl flex flex-col justify-center items-center">
                        <Image className="object-cover " alt="" src="/logos/logo-acolher.png" width={193} height={113}></Image>
                    </div>
                    <div className="flex mx-auto space-x-3 mt-2">
                        <Image className="object-cover " alt="" src="/icons/icon 1.png" width={32} height={32}></Image>
                        <Image className="object-cover " alt="" src="/icons/icon 2.png" width={32} height={32}></Image>
                        <Image className="object-cover " alt="" src="/icons/icon 3.png" width={32} height={32}></Image>
                        <Image className="object-cover " alt="" src="/icons/icon 4.png" width={32} height={32}></Image>
                    </div>
                </div>
                <div className="flex mx-auto justify-around gap-10 xl:gap-35">
                    <div className="font-[Poppins-regular] text-white space-y-2 mt-4 w-fit">
                        <p className="font-[Poppins-semibold] text-xl">Empresas</p>
                        <p>Sobre</p>
                        <p>Termos de uso</p>
                        <p>Responsáveis<br/>Técnicos</p>
                    </div>
                    <div className="font-[Poppins-regular] text-white space-y-2 mt-4 w-fit">
                        <p className="font-[Poppins-semibold] text-xl">Fale conosco</p>
                        <p>Contato</p>
                        <p>Dúvidas</p>
                        <p>Parcerias</p>
                    </div>
                </div>
                <div className='mt-3 text-white'>
                    <form className='mx-auto space-y-3 relative w-fit'>
                        <p className='text-center font-["Poppins-regular"] text-xl'>Esteja por dentro das <span className='font-["Poppins-semibold"]'>novidades</span></p>
                        <input className='bg-white w-full pr-40 rounded-xl px-5 py-4 text-gray-700 placeholder-gray-500 focus:outline-none' type="email" placeholder='Seu E-Mail'></input>
                        <input className='absolute lg:top-11 sm:top-18 top-11 right-2 text-white font-["Inter-semibold"] bg-[linear-gradient(to_right,_#4BA8FF_0%,_#1C71E4_48%,_#44D7D1_100%)] rounded-xl px-6 py-3 shadow-lg hover:brightness-110 transition duration-300 cursor-pointer' type="submit" value="Me Inscrever"></input> 
                    </form>
                </div>
            </div>
                <div className="font-['Poppins-regular'] text-white flex gap-6 justify-around sm:mt-3 sm:justify-between">
                    <p>Copyright © <span className="font-['Poppins-medium']">2025 BrailleWay</span></p>
                    <p>Políticas</p>
                </div>
        </div>
    </footer>
  );
}