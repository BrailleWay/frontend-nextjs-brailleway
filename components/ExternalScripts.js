// ficheiro: components/ExternalScripts.js

"use client";

import { useEffect, useRef } from 'react';

export default function ExternalScripts() {
  const visibilityRepairman = useRef(null);

  useEffect(() => {
    // Previne que o script seja adicionado várias vezes
    if (document.getElementById('vlibras-plugin-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'vlibras-plugin-script';
    script.src = 'https://cdn.jsdelivr.net/gh/spbgovbr-vlibras/vlibras-portal@dev/app/vlibras-plugin.js';
    script.async = true;

    script.onload = () => {
      new window.VLibras.Widget('https://vlibras.gov.br/app');
      console.log('VLibras Widget inicializado. A ativar o reparador de visibilidade...');

      // Limpa qualquer reparador antigo que possa estar a correr
      if (visibilityRepairman.current) {
        clearInterval(visibilityRepairman.current);
      }

      // --- O REPARADOR DE FORÇA BRUTA ---
      visibilityRepairman.current = setInterval(() => {
        const accessButton = document.querySelector('div[vw-access-button]');
        
        // Se o botão de acesso existir, forçamos o seu estilo
        if (accessButton) {
          // Forçamos o estilo diretamente no elemento para máxima prioridade
          accessButton.style.display = 'flex';
          accessButton.style.position = 'fixed';
          accessButton.style.bottom = '20px';
          accessButton.style.right = '20px';
          accessButton.style.width = '40px'; // Tamanho padrão do botão
          accessButton.style.height = '40px'; // Tamanho padrão do botão
          accessButton.style.opacity = '1';
          accessButton.style.visibility = 'visible';
          accessButton.style.zIndex = '1000'; // Garante que fica por cima
        }
      }, 250); // Verifica e repara 4 vezes por segundo
    };

    document.body.appendChild(script);

    // --- Função de Limpeza ---
    return () => {
      console.log('A parar o reparador de visibilidade.');
      if (visibilityRepairman.current) {
        clearInterval(visibilityRepairman.current);
      }
    };
  }, []);

  // O JSX inicial que o VLibras precisa de encontrar
  return (
    <div vw="true" className="enabled">
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}