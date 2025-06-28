// file: app/perfil/page.js

import { auth } from '@/auth'; // Importa a função auth do servidor
import { redirect } from 'next/navigation';
import { User, Calendar, Mail, Phone } from 'lucide-react';


export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Meu Perfil</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-blue-600" />
              </div>
              <div>
                {/* Acessamos os dados diretamente, sem '?' opcionais, pois sabemos que a sessão existe */}
                <h2 className="text-xl font-semibold text-gray-800">{session.user.name}</h2>
                <p className="text-gray-500">{session.user.role === 'paciente' ? 'Paciente' : 'Médico'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <span className="text-gray-700">{session.user.email}</span>
              </div>
              
              {/* Esta verificação continua útil caso o telefone seja opcional */}
              {session.user.telefone && (
                <div className="flex items-center space-x-3">
                  <Phone size={20} className="text-gray-400" />
                  <span className="text-gray-700">{session.user.telefone}</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar size={20} className="text-gray-400" />
                <span className="text-gray-700">
                  {/* O 'createdAt' pode não estar na sessão, então uma verificação é segura */}
                  Membro desde {new Date(session.user.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {/* O restante da sua UI continua igual */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações</h3>
              <div className="space-y-3">
                <a
                  href="/consultas"
                  className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Ver Minhas Consultas
                </a>
                {session.user.role === 'paciente' && (
                  <a
                    href="/procurar-especialista"
                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Agendar Nova Consulta
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}