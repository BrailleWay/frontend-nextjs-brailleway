import { getConsultasUsuario } from '@/lib/actions';
import ConsultaCard from './ConsultaCard';    

export default async function ConsultasPage() {
  const consultas = await getConsultasUsuario();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Consultas</h1>
        {consultas && consultas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {consultas.map((consulta) => (
              <ConsultaCard key={consulta.id} consulta={consulta} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Você não tem nenhuma consulta futura agendada.</p>
          </div>
        )}
      </main>
    </div>
  );
} 