/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegúrate de que no haya ninguna línea 'module.exports =' aquí

  async rewrites() {
    return [
      {
        source: "/api/intramuros",
        destination:
          "https://script.google.com/macros/s/AKfycbyLeN9z1JvTmVs9S8cvQSgmZXKO7LIK33pKzR4Ulk4oMeO4zODhKI0iD2hN5dA4DMh1gw/exec",
      },
    ];
  },
};

export default nextConfig;
