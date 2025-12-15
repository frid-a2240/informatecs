/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegúrate de que no haya ninguna línea 'module.exports =' aquí

  async rewrites() {
    return [
      {
        source: "/api/intramuros",
        destination:
          "https://script.google.com/macros/s/AKfycbwPzcFI5HT_3zpJG3x2xvx55hA3E_gRuKHPx9EesSafG5oq8CbjcDpqYh5x_6SNlWCk/exec",
      },
    ];
  },
};

export default nextConfig;
