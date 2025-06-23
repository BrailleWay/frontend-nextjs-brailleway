"use client";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('pt-br');

const TZ = "America/Sao_Paulo";

export default function ConsultaCard({ consulta }) {
  const dataHoraLocal = dayjs.utc(consulta.dataHora).tz(TZ);
  const dataHoraFimLocal = dayjs.utc(consulta.dataHoraFim).tz(TZ);

  const dia = dataHoraLocal.format('DD');
  const mes = dataHoraLocal.format('MMM').replace('.', '');
  const horaInicio = dataHoraLocal.format('HH:mm');
  const horaFim = dataHoraFimLocal.format('HH:mm');
  
  const especialidade = consulta.medico.especialidade?.nome || "Especialidade não informada";

  const nomeMedico = consulta.medico?.nome || "Médico";
  const nomePaciente = consulta.paciente?.nome || null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between transition-transform hover:scale-105">
      <div className="flex items-start gap-4 mb-4">
        <div className="text-center flex-shrink-0">
          <div className="bg-blue-100 text-blue-600 font-bold rounded-md p-2 w-16">
            <div className="text-3xl">{dia}</div>
            <div className="text-sm capitalize">{mes}</div>
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-lg text-gray-800">{nomeMedico}</h3>
          {nomePaciente && (
            <p className="text-sm text-gray-700">Paciente: <span className="font-semibold">{nomePaciente}</span></p>
          )}
          <p className="text-sm text-gray-500">{`${horaInicio} até ${horaFim}`}</p>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-bold text-gray-700">Especialidade do médico</h4>
        <p className="text-sm text-gray-600">{especialidade}</p>
      </div>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
        ENTRAR
      </button>
    </div>
  );
} 