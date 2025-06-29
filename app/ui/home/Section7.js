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
    <div className="bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4,_#44D7D1)] w-full pb-6">
      <div className="text-white max-w-7xl mx-auto px-4 flex flex-col">

        {/* TÍTULOS */}
        <h2 className='tracking-widest mt-10 font-poppins font-semibold text-center text-3xl lg:text-4xl'>
          Nossos Planos
        </h2>
        <h3 className='text-center font-poppins text-base lg:text-lg lg:w-2/3 mx-3 lg:mx-auto mt-3'>
          Nossos Pacotes de Cuidados Acessíveis foram pensados para oferecer
          qualidade, conforto e bem-estar a preços justos.
        </h3>

        {/* BOTÕES DE SELEÇÃO */}
        <div className='mt-6 flex flex-row items-center font-poppins font-semibold rounded-full w-fit mx-auto outline outline-white p-1.5 gap-3'>
          <button
            onClick={() => setAtivo("planos")}
            className={`cursor-pointer rounded-full px-6 py-2 text-base ${
              ativo === "planos"
                ? "text-[#338DEF] bg-white"
                : "text-white bg-transparent"
            }`}
          >
            Planos
          </button>
          <button
            onClick={() => setAtivo("avulso")}
            className={`cursor-pointer rounded-full px-6 py-2 text-base ${
              ativo === "avulso"
                ? "text-[#338DEF] bg-white"
                : "text-white bg-transparent"
            }`}
          >
            Avulso
          </button>
        </div>

        {/* CONTEÚDO DOS CARDS */}
        <div className="w-full mt-10 gap-10 p-6 mb-10 bg-white rounded-4xl font-poppins font-medium">
          <AnimatePresence mode="wait">
            {ativo === "planos" ? (
              <motion.div
                key="planos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12">

                  {/* CARD 1 */}
                  <div className="outline outline-gray-200 w-[300px] lg:w-[360px] space-y-5 p-7 rounded-4xl flex flex-col">
                    <h2 className='text-4xl font-poppins font-bold text-[#231D4F]'>
                      R$50  <span className="text-gray-400 text-lg">/mês</span>
                    </h2>
                    <h3 className="text-[#231D4F] text-2xl flex items-center gap-2">
                      <motion.div {...pulseAnimation}>
                        <Stethoscope size={24} />
                      </motion.div>
                      Starter
                    </h3>
                    <p className="text-gray-600 text-base">Automação Básica</p>
                    <div className="space-y-3">
                      {["Sessões: 1 sessão / mês", "Duração: 40 minutos", "Suporte Básico"].map(
                        (item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-gray-600">
                            <div className="bg-gray-100/70 rounded-full w-7 h-7 flex items-center justify-center">
                              ✔
                            </div>
                            <p>{item}</p>
                          </div>
                        )
                      )}
                    </div>
                    <button className="mt-6 py-3 rounded-full bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] text-white text-base w-full cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
                      Comprar Agora
                    </button>
                  </div>

                  {/* CARD DO MEIO */}
                  <div className="outline outline-gray-200 w-[320px] lg:w-[380px] space-y-5 p-7 rounded-4xl flex flex-col bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] shadow-3xl scale-105">
                    <div className="flex justify-end">
                      <p className="bg-white text-[#1C71E4] rounded-4xl px-5 py-1 outline outline-[#1C71E4]">
                        Mais Popular
                      </p>
                    </div>
                    <h2 className='text-white text-4xl font-poppins font-bold'>
                      R$80 <span className="text-lg">/mês</span>
                    </h2>
                    <h3 className="text-white text-2xl flex items-center gap-2">
                      <motion.div {...pulseAnimation}>
                        <HeartPulse size={24} />
                      </motion.div>
                      Profissional
                    </h3>
                    <p className="text-white text-base">Automação Profissional</p>
                    <div className="space-y-3">
                      {["Multi-step Zaps", "Suporte Premium", "Integrações Ilimitadas"].map(
                        (item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-white">
                            <div className="bg-white/30 rounded-full w-7 h-7 flex items-center justify-center">
                              ✔
                            </div>
                            <p>{item}</p>
                          </div>
                        )
                      )}
                    </div>
                    <button className="mt-6 py-3 rounded-full bg-white text-[#1C71E4] text-base w-full cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
                      Comprar Agora
                    </button>
                  </div>

                  {/* CARD 3 */}
                  <div className="outline outline-gray-200 w-[300px] lg:w-[360px] space-y-5 p-7 rounded-4xl flex flex-col">
                    <h2 className='text-4xl font-poppins font-bold text-[#231D4F]'>
                      R$49 <span className="text-gray-400 text-lg">/mês</span>
                    </h2>
                    <h3 className="text-[#231D4F] text-2xl flex items-center gap-2">
                      <motion.div {...pulseAnimation}>
                        <BriefcaseMedical size={24} />
                      </motion.div>
                      Enterprise
                    </h3>
                    <p className="text-gray-600 text-base">Soluções Avançadas</p>
                    <div className="space-y-3">
                      {["Multi-step Zaps", "Suporte Dedicado", "Integrações Customizadas"].map(
                        (item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-gray-600">
                            <div className="bg-gray-100/70 rounded-full w-7 h-7 flex items-center justify-center">
                              ✔
                            </div>
                            <p>{item}</p>
                          </div>
                        )
                      )}
                    </div>
                    <button className="mt-6 py-3 rounded-full bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] text-white text-base w-full cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
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
                <div className="flex flex-col items-center justify-center text-center gap-8">
                  <h2 className='text-[#231D4F] text-4xl font-poppins font-bold'>
                    Consulta Avulsa
                  </h2>
                  <p className="text-gray-600 text-base lg:w-[60%]">
                    Ideal para quem busca um atendimento pontual, sem compromissos mensais.  
                    A flexibilidade que você precisa, com a qualidade que merece.
                  </p>
                  <h3 className='text-3xl text-[#1C71E4] font-poppins font-bold'>
                    R$80 <span className="text-gray-500 text-lg">por consulta</span>
                  </h3>
                  <button className="mt-4 py-3 rounded-full bg-[linear-gradient(to_right,_#4BA8FF,_#1C71E4)] text-white text-base w-[220px] cursor-pointer hover:scale-105 transition-transform shadow-md hover:shadow-xl">
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
