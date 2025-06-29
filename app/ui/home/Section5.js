"use client";

export const Section5 = () => {
  return (
    <section className="w-full bg-white flex justify-center px-4 py-20">
      <div className="w-full max-w-[1200px] flex flex-col items-center">

        {/* TÍTULO */}
        <h2 className="text-4xl md:text-5xl font-urbanist font-medium text-[#111] text-center mb-10 leading-tight">
          Veja como <span className="text-[#1C71E4] font-bold font-urbanist">transformamos vidas</span>
        </h2>

        {/* VÍDEO */}
        <div className="w-full rounded-3xl overflow-hidden shadow-xl">
          <video
            className="w-full h-auto"
            controls
            playsInline
          >
            <source src="/videos/Anuncio.mp4" type="video/mp4" />
            Seu navegador não suporta vídeo.
          </video>
        </div>
      </div>
    </section>
  );
};

export default Section5;
