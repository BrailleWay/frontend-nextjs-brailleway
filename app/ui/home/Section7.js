"use client";

import { X, HeartPulse, Stethoscope, BriefcaseMedical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Section7() {
  const [ativo, setAtivo] = useState("planos");

  const pulseAnimation = {
    animate: {
      scale: [1, 1.2, 1],
      transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" },
    },
  };

  return (
    <div className="bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4,_#44D7D1)] w-full">
      <div className="text-white max-w-7xl mx-auto px-4 flex flex-col">

        {/* TÍTULOS */}
        <h2 className='tracking-widest mt-10 font-["Poppins-SemiBold"] text-center text-4xl'>
          Nossos Planos
        </h2>
        <h3 className='text-center font-["Poppins-Regular"] text-lg lg:text-xl lg:w-2/3 mx-3 lg:mx-auto mt-4'>
          Nossos Pacotes de Cuidados Acessíveis foram pensados para oferecer
          qualidade, conforto e bem-estar a preços justos.
        </h3>

        {/* BOTÕES DE SELEÇÃO */}
        <div className='mt-8 flex flex-row items-center font-["Poppins-SemiBold"] rounded-full w-fit mx-auto outline outline-white p-2 gap-4'>
          <button
            onClick={() => setAtivo("planos")}
            className={`cursor-pointer rounded-full px-7 py-3 text-lg ${
              ativo === "planos"
                ? "text-[#338DEF] bg-white"
                : "text-white bg-transparent"
            }`}
          >
            Planos
          </button>
          <button
            onClick={() => setAtivo("avulso")}
            className={`cursor-pointer rounded-full px-7 py-3 text-lg ${
              ativo === "avulso"
                ? "text-[#338DEF] bg-white"
                : "text-white bg-transparent"
            }`}
          >
            Avulso
          </button>
        </div>

        {/* CONTEÚDO DOS CARDS */}
        <div className="w-full mt-12 gap-20 p-8 mb-14 bg-white rounded-4xl font-['Poppins-Medium']">
          <AnimatePresence mode="wait">
            {ativo === "planos" ? (
              <motion.div
                key="planos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col lg:flex-row items-center justify-center gap-16">

                  {/* CARD 1 */}
                  <div className="outline outline-gray-200 w-[340px] lg:w-[400px] space-y-6 p-10 rounded-4xl flex flex-col">
                    <h2 className='text-5xl font-["Poppins-Bold"] text-[#231D4F]'>
                      R$19 <span className="text-gray-400 text-xl">/mês</span>
                    </h2>
                    <h3 className="text-[#231D4F] text-3xl flex items-center gap-2">
                      <motion.div {...pulseAnimation}>
                        <Stethoscope size={26} />
                      </motion.div>
                      Starter
                    </h3>
                    <p className="text-gray-600 text-lg">Automação Básica</p>
                    <div className="space-y-4">
                      {["Multi-step Zaps", "Suporte Básico", "Integrações Limitadas"].map(
                        (item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-gray-600">
                            <div className="bg-gray-100/70 rounded-full w-8 h-8 flex items-center justify-center">
                              <X size={18} />
                            </div>
                            <p>{item}</p>
                          </div>
                        )
                      )}
                    </div>
                    <button className="mt-8 py-4 rounded-full bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] text-white text-lg w-full cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
                      Comprar Agora
                    </button>
                  </div>

                  {/* CARD DO MEIO */}
                  <div className="outline outline-gray-200 w-[360px] lg:w-[420px] space-y-6 p-10 rounded-4xl flex flex-col bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] shadow-3xl scale-105">
                    <div className="flex justify-end">
                      <p className="bg-white text-[#1C71E4] rounded-4xl px-6 py-1 outline outline-[#1C71E4]">
                        Mais Popular
                      </p>
                    </div>
                    <h2 className='text-white text-5xl font-["Poppins-Bold"]'>
                      R$29 <span className="text-xl">/mês</span>
                    </h2>
                    <h3 className="text-white text-3xl flex items-center gap-2">
                      <motion.div {...pulseAnimation}>
                        <HeartPulse size={26} />
                      </motion.div>
                      Profissional
                    </h3>
                    <p className="text-white text-lg">Automação Profissional</p>
                    <div className="space-y-4">
                      {["Multi-step Zaps", "Suporte Premium", "Integrações Ilimitadas"].map(
                        (item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-white">
                            <div className="bg-white/30 rounded-full w-8 h-8 flex items-center justify-center">
                              ✔
                            </div>
                            <p>{item}</p>
                          </div>
                        )
                      )}
                    </div>
                    <button className="mt-8 py-4 rounded-full bg-white text-[#1C71E4] text-lg w-full cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
                      Comprar Agora
                    </button>
                  </div>

                  {/* CARD 3 */}
                  <div className="outline outline-gray-200 w-[340px] lg:w-[400px] space-y-6 p-10 rounded-4xl flex flex-col">
                    <h2 className='text-5xl font-["Poppins-Bold"] text-[#231D4F]'>
                      R$49 <span className="text-gray-400 text-xl">/mês</span>
                    </h2>
                    <h3 className="text-[#231D4F] text-3xl flex items-center gap-2">
                      <motion.div {...pulseAnimation}>
                        <BriefcaseMedical size={26} />
                      </motion.div>
                      Enterprise
                    </h3>
                    <p className="text-gray-600 text-lg">Soluções Avançadas</p>
                    <div className="space-y-4">
                      {["Multi-step Zaps", "Suporte Dedicado", "Integrações Customizadas"].map(
                        (item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-gray-600">
                            <div className="bg-gray-100/70 rounded-full w-8 h-8 flex items-center justify-center">
                              ✔
                            </div>
                            <p>{item}</p>
                          </div>
                        )
                      )}
                    </div>
                    <button className="mt-8 py-4 rounded-full bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] text-white text-lg w-full cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
                      Comprar Agora
                    </button>
                  </div>

                </div>
              </motion.div>
            ) : (
              <motion.div
                key="avulso"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* TELA AVULSO */}
                <div className="flex flex-col items-center justify-center text-center gap-10">
                  <h2 className='text-[#231D4F] text-5xl font-["Poppins-Bold"]'>
                    Consulta Avulsa
                  </h2>
                  <p className="text-gray-600 text-lg lg:w-[60%]">
                    Ideal para quem busca um atendimento pontual, sem compromissos mensais.  
                    A flexibilidade que você precisa, com a qualidade que merece.
                  </p>
                  <h3 className='text-4xl text-[#1C71E4] font-["Poppins-Bold"]'>
                    R$80 <span className="text-gray-500 text-xl">por consulta</span>
                  </h3>
                  <button className="mt-4 py-4 rounded-full bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] text-white text-lg w-[250px] cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
                    Comprar Agora
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
