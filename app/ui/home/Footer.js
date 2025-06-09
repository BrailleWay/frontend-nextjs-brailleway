import Image from 'next/image'
import Link from 'next/link'

export default function Footer(){
    return(
        <footer className=' text-white bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] flex flex-col'>
            <div className='bg-white outline text text-black'>
                <p className='text-[#464444] text-center p-2 font-["Inter-medium"]'>Atenção: Este site não oferece tratamento ou aconselhamento imediato para pessoas em crise suicida. Em caso de crise, ligue para 188 (CVV) ou acesse o site www.cvv.org.br. Em caso de emergência, procure atendimento em um hospital mais próximo.</p>
            </div>
            <div className='container md:justify-between md:max-w-8xl md:w-full md:flex-row flex flex-col md:mx-auto md:space-x-10'>
                <div className="md:flex-col mx-28 md:mx-0 flex flex-row justify-between items-center md:my-auto md:rounded-2xl md:w-50 md:bg-white">
                    <Image className='mt-3' alt='' src="/home/logo.png" width={49} height={47} />
                    <div className='mt-3 flex flex-row gap-1 bg-white md:bg-transparent rounded-sm p-1.5'>
                        <Link href="/homepage">
                            <Image alt='' src="/home/facebook.png" width={32} height={32} />
                        </Link>
                        <Link href="/homepage">
                            <Image alt='' src="/home/X.png" width={32} height={32} />
                        </Link>
                        <Link target='_blank' href="https://www.linkedin.com/company/brailleway/">
                            <Image alt='' src="/home/linkedin.png" width={32} height={32} />
                        </Link>
                        <Link href="/homepage">
                            <Image alt='' src="/home/instagram.png" width={32} height={32} />
                        </Link>
                    </div>
                </div>
            

                <div className=' mt-5 Categorias flex flex-row gap-15 justify-center'>
                    <div className='Empresa flex flex-col space-y-2'>
                        <h2 className='md:text-xl font-["Poppins-semibold"]'>Empresa</h2>
                        <h3 className='md:text-md font-["Poppins-regular"]'>Sobre</h3>
                        <h3 className='md:text-md font-["Poppins-regular"]'>Termos de Uso</h3>
                        <h3 className='md:text-md font-["Poppins-regular"]'>Responsáveis Técnicos</h3>
                    </div>
                    <div className='FaleConosco flex flex-col space-y-2'>
                        <h2 className='md:text-xl font-["Poppins-semibold"]'>Fale Conosco</h2>
                        <h3 className='md:text-md font-["Poppins-regular"]'>Contato</h3>
                        <h3 className='md:text-md font-["Poppins-regular"]'>Dúvidas</h3>
                        <h3 className='md:text-md font-["Poppins-regular"]'>Parceiros e contribuidores</h3>
                    </div>
                </div>
                <div className='Newsletter mt-3'>
                    <form className='flex flex-col mx-auto space-y-3 relative w-full max-w-md'>
                        <h2 className='md:text-xl md:mt-2.25 font-["Poppins-regular"] text-2xl'>Esteja por dentro das <span className='font-["Poppins-semibold"]'>novidades</span></h2>
                        <input className='bg-white w-full pr-40 rounded-xl px-5 py-4 text-gray-700 placeholder-gray-500 focus:outline-none' type="email" placeholder='Seu E-Mail'></input>
                        <input className='absolute top-12 left-75 xs:left-63 md:top-13 md:left-55 mx-auto md:mx-0 md:w-35 text-white font-["Inter-semibold"] bg-[linear-gradient(to_right,_#4BA8FF_0%,_#1C71E4_48%,_#44D7D1_100%)] rounded-xl px-6 py-3 shadow-lg hover:brightness-110 transition duration-300 cursor-pointer' type="submit" value="Me Inscrever"></input> 
                    </form>
                </div>
        </div>
            <div className='font-["Poppins-medium"] container  md:mx-auto md:w-full mt-3 flex flex-row justify-between mx-20'>
                <p>Copyright © 2025 BrailleWay</p>
                <p>Politicas | Termos de Uso</p>
            </div>
        </footer>
    )
}