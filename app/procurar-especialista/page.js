"use client";

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Search, User, Calendar } from 'lucide-react';

export default function ProcurarEspecialistaPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Procurar Especialista</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Search size={24} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Encontre o especialista ideal para você</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especialidade
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione uma especialidade</option>
                    <option value="psicologia">Psicologia</option>
                    <option value="psiquiatria">Psiquiatria</option>
                    <option value="neurologia">Neurologia</option>
                    <option value="cardiologia">Cardiologia</option>
                    <option value="ortopedia">Ortopedia</option>
                    <option value="dermatologia">Dermatologia</option>
                    <option value="ginecologia">Ginecologia</option>
                    <option value="pediatria">Pediatria</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data da consulta
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário preferencial
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Qualquer horário</option>
                    <option value="manha">Manhã (8h - 12h)</option>
                    <option value="tarde">Tarde (13h - 18h)</option>
                    <option value="noite">Noite (18h - 22h)</option>
                  </select>
                </div>

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Buscar Especialistas
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Como funciona?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Escolha a especialidade</h4>
                      <p className="text-sm text-gray-600">Selecione a área médica que você precisa</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Defina data e horário</h4>
                      <p className="text-sm text-gray-600">Escolha quando você está disponível</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Agende sua consulta</h4>
                      <p className="text-sm text-gray-600">Confirme o agendamento com o especialista</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 