// file: components/ExternalScripts.js

"use client";

import Script from 'next/script';

export default function ExternalScripts() {
  return (
    <>
      {/* Script do UserWay Widget */}
      <Script
        src="https://cdn.userway.org/widget.js"
        strategy="lazyOnload"
        data-account="An0lOgTRcx"
      />

      {/* Container que o VLibras utiliza para se anexar */}
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>

      {/* Script do VLibras Widget */}
      <Script
        id="vlibras-plugin"
        src="https://cdn.jsdelivr.net/gh/spbgovbr-vlibras/vlibras-portal@dev/app/vlibras-plugin.js"
        strategy="lazyOnload"
        onLoad={() => {
          // Este código só roda DEPOIS que o script acima for carregado com sucesso
          if (window.VLibras) {
            new window.VLibras.Widget('https://vlibras.gov.br/app');
          } else {
            console.error('Falha ao inicializar o VLibras: o objeto window.VLibras não foi encontrado.');
          }
        }}
      />
    </>
  );
}