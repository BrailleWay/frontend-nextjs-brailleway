// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',          // quando alguém acessar “/”
        destination: '/homepage', // leve para “/home”
        permanent: true       // usar 308 (padrão do Next.js) para indicar redirect “permanente”
      }
    ]
  }
};

export default nextConfig;
