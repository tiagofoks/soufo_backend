// pages/_app.js

// Importa o arquivo global que contém as diretivas do Tailwind
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;