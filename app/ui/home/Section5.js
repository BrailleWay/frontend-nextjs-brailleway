"use client";

export const Section5 = () => {
  return (
    <section className="w-full bg-white flex justify-center px-4 py-20">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        {/* TÍTULO */}
        <h2 className="text-4xl md:text-5xl font-urbanist font-medium text-[#111] text-center mb-10 leading-tight">
          Veja como <span className="text-[#1C71E4] font-bold">transformamos vidas</span>
        </h2>

        {/* VÍDEO OTIMIZADO */}
        {/* Usamos aspect-ratio para evitar CLS e bg-black para um fundo elegante antes do poster carregar */}
        <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl bg-black">
          <video
            className="w-full h-full"
            controls
            playsInline
            preload="none" // A otimização mais importante
            poster="/videos/poster_anuncio.webp" // Use uma imagem de capa leve
            sizes
          >
            {/* Forneça o formato mais moderno primeiro */}
            <source src="/videos/Anuncio.webm" type="video/webm" />
            <source src="/videos/Anuncio.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Section5;