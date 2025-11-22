/** @type {import('next').NextConfig} */
const nextConfig = {
    // 1. Essencial para exportação estática (você já tem)
    output: 'export', 
    
    // 2. BasePath: Usado para navegação interna
    basePath: '/orcamento', 
    
    // 3. AssetPrefix: O MAIS CRUCIAL para arquivos JS/CSS (Onde está o 404)
    assetPrefix: '/orcamento/', // Note a barra final
    
    // 4. Imagens (você já tem)
    images: {
        unoptimized: true, 
    },
};

module.exports = nextConfig;