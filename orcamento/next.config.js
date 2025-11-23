/** @type {import('next').NextConfig} */

// Verifica se o ambiente de execução é de produção (usado no npm run build)
const isProd = process.env.NODE_ENV === 'production';

// Define o nome do repositório
const repoName = 'orcamento';

// Aplica o prefixo e o basePath apenas em produção
const basePath = isProd ? `/${repoName}` : '';
const assetPrefix = isProd ? `/${repoName}/` : '';

const nextConfig = {
    // 1. OUTPUT: Aplica 'export' apenas se for build de produção
    output: isProd ? 'export' : undefined, 
    
    // 2. CAMINHO BASE: /orcamento em prod, vazio em dev
    basePath: basePath, 
    
    // 3. PREFIXO DOS ATIVOS (JS, CSS): /orcamento/ em prod, vazio em dev
    assetPrefix: assetPrefix, 
    
    images: {
        unoptimized: true, 
    },
};

module.exports = nextConfig;