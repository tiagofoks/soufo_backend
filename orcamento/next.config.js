/** @type {import('next').NextConfig} */
const nextConfig = {
    // Essencial para exportação estática
    output: 'export', 
    
    // Caminho base para navegação interna
    basePath: '/orcamento', 
    
    // ESSENCIAL para carregar JS/CSS estáticos corretamente no GitHub Pages
    assetPrefix: '/orcamento/', 
    
    images: {
        unoptimized: true, 
    },
};

module.exports = nextConfig;