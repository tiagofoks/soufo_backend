import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { User, DollarSign, Printer, Save, RefreshCw, ArrowRight, Home, Mail, Phone, MapPin, Package, Sun, Ruler, Clock, AlertTriangle, Send } from 'lucide-react';

// 🚨 NOVO: Importação do Firebase
import { initializeApp } from 'firebase/app';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    collection, 
    serverTimestamp, 
} from 'firebase/firestore';

// Importação da biblioteca de geração de PDF
// Certifique-se de que 'html2pdf.js' está instalado!
// import html2pdf from 'html2pdf.js'; 

// 🚨 NOVO: Configurações do Firebase (SUBSTITUA PELAS SUAS CHAVES!)
const firebaseConfig = {
  apiKey: "AIzaSyBTeQSKtaXdm5tI9APbniKGbvwhQP205JU",
  authDomain: "orcamento-44592.firebaseapp.com",
  projectId: "orcamento-44592",
  storageBucket: "orcamento-44592.firebasestorage.app",
  messagingSenderId: "946840065878",
  appId: "1:946840065878:web:432102f1113927e6cb28f7",
  measurementId: "G-M1S34G3D62"
};

// 🚨 Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variáveis Globais (Novas chaves para Firestore)
const APP_ID = 'local-budget-app'; 
// 🚨 NOVO: Chaves de Coleção e Documento
const COLLECTIONS = {
    BASE_PRICES: 'base_prices',
    BUDGETS: 'budgets',
};
const DOC_IDS = {
    BASE_PRICES_DOC: 'global_prices', // Documento único para todos os preços base
};


// --- Dados Iniciais (MANTIDOS) ---
const INITIAL_ITEMS = [
    { id: 'boiler2', description: 'RESERVATÓRIO DE 200 LTS BAIXA PRESSÃO KISOLTEC', unitPrice: 2408.00, qty: 0, details: 'Reservatório interno em INOX 304, Revestimento em Poliuretano Expandido, Apoio elétrico 3000W.' },
    { id: 'boiler3', description: 'RESERVATÓRIO DE 300 LTS BAIXA PRESSÃO KISOLTEC', unitPrice: 2898.00, qty: 0, details: 'Reservatório interno em INOX 304, Revestimento em Poliuretano Expandido, Apoio elétrico 3000W.' },
    { id: 'boiler4', description: 'RESERVATÓRIO DE 400 LTS BAIXA PRESSÃO KISOLTEC', unitPrice: 3315.00, qty: 0, details: 'Reservatório interno em INOX 304, Revestimento em Poliuretano Expandido, Apoio elétrico 3000W.' },
    { id: 'boiler5', description: 'RESERVATÓRIO DE 500 LTS BAIXA PRESSÃO KISOLTEC', unitPrice: 3864.00, qty: 0, details: 'Reservatório interno em INOX 304, Revestimento em Poliuretano Expandido, Apoio elétrico 3000W.' },
    { id: 'boiler6', description: 'RESERVATÓRIO DE 600 LTS BAIXA PRESSÃO KISOLTEC', unitPrice: 4447.00, qty: 0, details: 'Reservatório interno em INOX 304, Revestimento em Poliuretano Expandido, Apoio elétrico 3000W.' },
    { id: 'boiler8', description: 'RESERVATÓRIO DE 800 LTS BAIXA PRESSÃO KISOLTEC', unitPrice: 5315.00, qty: 0, details: 'Reservatório interno em INOX 304, Revestimento em Poliuretano Expandido, Apoio elétrico 3000W.' },
    { id: 'boiler10', description: 'RESERVATÓRIO DE 1000 LTS BAIXA PRESSÃO KISOLTEC', unitPrice: 6157.00, qty: 0, details: 'Reservatório interno em INOX 304, Revestimento em Poliuretano Expandido, Apoio elétrico 3000W.' },
    { id: 'placas', description: 'COLETORES SOLAR KISOLTEC - MODELO ULTRATEC 1.50x0.90', unitPrice: 1220.00, qty: 0, details: 'Máximo aproveitamento por m², Certificado pelo INMETRO e Selo PROCEL.' },
    { id: 'placas2', description: 'COLETORES SOLAR KISOLTEC - MODELO ULTRATEC 2.00x0.90', unitPrice: 1536.00, qty: 0, details: 'Máximo aproveitamento por m², Certificado pelo INMETRO e Selo PROCEL.' },
    { id: 'pressurizador', description: 'PRESSURIZADOR MAX POWER (EM INOX)', unitPrice: 1425.00, qty: 0, details: 'Garante pressão ideal pós-boiler.' },
    { id: 'kit_instalacao', description: 'KIT MATERIAL (EM COBRE) P/INSTALAÇÃO (ESTIMATIVA)', unitPrice: 1900.00, qty: 0, details: 'Tubulação e conexões para montagem do sistema.' },
    { id: 'timer', description: 'TIMER DIGITAL TLZ', unitPrice: 580.00, qty: 0, details: 'Controle de apoio elétrico.' },
    { id: 'mao_obra', description: 'MÃO DE OBRA DE INSTALAÇÃO (ESTIMATIVA)', unitPrice: 950.00, qty: 0, details: 'Instalação e testes do sistema completo.' },
];

// --- Funções Utilitárias (MANTIDAS) ---
const cleanNumber = (value) => parseFloat(String(value).replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
const formatCurrency = (value) => `R$ ${parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

// Geração de ID simples e único (para orçamentos locais)
const generateLocalId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

// --- CUSTOM HOOK: useBudget (Lógica de Estado e FIREBASE) ---
const useBudget = () => {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState('user_local_123'); // ID Fixo (idealmente viria de um Auth do Firebase)
    const [isAuthReady, setIsAuthReady] = useState(true); // Sempre pronto localmente
    const [basePrices, setBasePrices] = useState({}); 

    // Estado do Cliente (MANTIDO)
    const [client, setClient] = useState({
        nome: '',
        telefone: '',
        email: '',
        endereco: '',
        cidade: 'Sorocaba/SP',
    });

    // Estado dos Itens (MANTIDO)
    const [items, setItems] = useState(INITIAL_ITEMS.map(item => ({
        ...item,
        unitPrice: item.unitPrice,
        qty: item.qty,
    })));

    // 🚨 EFEITO DE CARREGAMENTO INICIAL (Preços Base do Firestore)
    useEffect(() => {
        const loadBasePricesFromFirestore = async () => {
            setLoading(true);
            try {
                // Referência ao documento de preços
                const docRef = doc(db, COLLECTIONS.BASE_PRICES, DOC_IDS.BASE_PRICES_DOC);
                const docSnap = await getDoc(docRef);

                let loadedPrices = {};

                if (docSnap.exists()) {
                    // Carrega os dados se o documento existir
                    loadedPrices = docSnap.data();
                } else {
                    console.log("Documento de Preços Base não encontrado, usando defaults.");
                    // Se não existir, o loadedPrices fica vazio, e os defaults serão usados abaixo
                }
                
                setBasePrices(loadedPrices);

                // Aplica os preços base carregados (ou o default inicial) aos itens atuais
                setItems(prevItems => prevItems.map(item => {
                    const persistedPrice = cleanNumber(loadedPrices[item.id]);
                    const newPrice = persistedPrice > 0 ? persistedPrice : item.unitPrice; 
                    return { 
                        ...item, 
                        unitPrice: newPrice 
                    };
                }));

            } catch (error) {
                console.error('Erro ao carregar preços base do Firestore:', error);
                // Em caso de erro, usa os preços iniciais definidos
            } finally {
                setLoading(false);
            }
        };

        if (isAuthReady) {
            loadBasePricesFromFirestore();
        }
    }, [isAuthReady]);

    // Handlers (MANTIDOS)
    const handleClientChange = useCallback((field, value) => {
        setClient(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleItemChange = useCallback((id, field, value) => {
        setItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    let newValue = field === 'description' ? value : cleanNumber(value);
                    if (field === 'qty' && newValue < 0) newValue = 0;
                    return { ...item, [field]: newValue };
                }
                return item;
            })
        );
    }, []);

    // Cálculo do Total (MANTIDO)
    const totalValue = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    }, [items]);
    
    // 🚨 Salvar Preços Base no Firestore (Substituindo LocalStorage)
    const saveBasePrices = useCallback(async (pricesToSave) => {
        setLoading(true);
        try {
            const dataToSave = {};
            // Converte valores para float
            Object.keys(pricesToSave).forEach(id => {
                dataToSave[id] = cleanNumber(pricesToSave[id]);
            });

            const docRef = doc(db, COLLECTIONS.BASE_PRICES, DOC_IDS.BASE_PRICES_DOC);
            
            // O setDoc com merge: true garante que apenas os campos fornecidos sejam atualizados
            await setDoc(docRef, dataToSave, { merge: true });

            setBasePrices(dataToSave); // Atualiza o estado para refletir a mudança
            return true;
        } catch (error) {
            console.error('Erro ao salvar preços base no Firestore:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);
    
    // 🚨 Salvar Orçamento no Firestore (Substituindo LocalStorage)
    const saveBudget = useCallback(async () => {
        setLoading(true);

        try {
            const budgetData = {
                client,
                items: items.map(item => ({
                    description: item.description,
                    qty: item.qty,
                    unitPrice: item.unitPrice,
                    subtotal: item.qty * item.unitPrice,
                    details: item.details,
                })),
                totalValue,
                createdBy: userId,
                createdAt: serverTimestamp(), // Data e hora do servidor do Firebase
                date: new Date().toLocaleDateString('pt-BR'), // Data formatada
                guarantees: ['03 ANOS P/BOILER', '03 ANOS P/COLETOR SOLAR', '01 ANO P/PRESSURIZADORES'],
                conditions: 'À COMBINAR',
            };

            // Adiciona um novo documento à coleção 'budgets' e o Firestore gera o ID
            const docRef = doc(collection(db, COLLECTIONS.BUDGETS));
            await setDoc(docRef, budgetData);
            
            return docRef.id;
        } catch (error) {
            console.error('Erro ao salvar orçamento no Firestore:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [client, items, totalValue, userId]);


    return {
        loading,
        userId,
        isAuthReady,
        client,
        items,
        totalValue,
        basePrices,
        handleClientChange,
        handleItemChange,
        saveBasePrices,
        saveBudget,
    };
};


// --- COMPONENTES DE APRESENTAÇÃO (Apenas alteração no texto dos botões e alertas) ---
const ClientForm = ({ client, handleClientChange }) => (
    <div className="bg-white p-6 shadow-xl rounded-lg border-t-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <User className="w-5 h-5 mr-2 text-blue-500" />
            1. Dados do Cliente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['nome', 'telefone', 'email', 'endereco', 'cidade'].map((field) => (
                <div key={field} className="flex flex-col">
                    <label htmlFor={field} className="text-sm font-medium text-gray-600 mb-1 capitalize flex items-center">
                        {field === 'nome' && <User className="w-4 h-4 mr-1 text-blue-400" />}
                        {field === 'telefone' && <Phone className="w-4 h-4 mr-1 text-blue-400" />}
                        {field === 'email' && <Mail className="w-4 h-4 mr-1 text-blue-400" />}
                        {field === 'endereco' && <Home className="w-4 h-4 mr-1 text-blue-400" />}
                        {field === 'cidade' && <MapPin className="w-4 h-4 mr-1 text-blue-400" />}
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                        id={field}
                        type={field === 'email' ? 'email' : 'text'}
                        value={client[field]}
                        onChange={(e) => handleClientChange(field, e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                        placeholder={`Digite o ${field}...`}
                    />
                </div>
            ))}
        </div>
    </div>
);

const ItemTable = ({ items, handleItemChange, totalValue }) => (
    <div className="bg-white p-6 shadow-xl rounded-lg border-t-4 border-green-500">
        <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
            <Package className="w-5 h-5 mr-2 text-green-500" />
            2. Itens e Valores
        </h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr className="text-left bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="p-3 w-16">QTDE</th>
                        <th className="p-3 w-72">ITEM</th>
                        <th className="p-3 w-32 text-right">PREÇO UNIT. (R$)</th>
                        <th className="p-3 w-32 text-right">SUBTOTAL</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item.id} className="hover:bg-green-50/50">
                            <td className="p-2">
                                <input
                                    type="number"
                                    value={item.qty}
                                    min="0"
                                    onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                                    className="w-full text-center p-1 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 text-sm"
                                />
                            </td>
                            <td className="p-2">
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                    className="w-full p-1 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                            </td>
                            <td className="p-2 text-right">
                                <input
                                    type="text"
                                    value={item.unitPrice.toFixed(2).replace('.', ',')}
                                    onChange={(e) => handleItemChange(item.id, 'unitPrice', e.target.value)}
                                    className="w-full text-right p-1 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 text-sm font-mono"
                                    placeholder="0,00"
                                />
                            </td>
                            <td className="p-2 text-right font-bold text-gray-700 font-mono">
                                {formatCurrency(item.qty * item.unitPrice)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-green-100 text-green-800 font-bold text-lg">
                        <td colSpan="3" className="p-3 text-right">TOTAL GERAL</td>
                        <td className="p-3 text-right">{formatCurrency(totalValue)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
);

const PriceSettings = ({ userId, isAuthReady, basePrices, saveBasePrices, loadingHook }) => {
    const [editingPrices, setEditingPrices] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (basePrices) {
            const initialEditing = {};
            INITIAL_ITEMS.forEach(item => {
                const price = basePrices[item.id] || item.unitPrice;
                initialEditing[item.id] = cleanNumber(price).toFixed(2).replace('.', ',');
            });
            setEditingPrices(initialEditing);
        }
    }, [basePrices]);

    const handlePriceChange = (id, value) => {
        const cleanedValue = value.replace(/[^0-9,]/g, '');
        setEditingPrices(prev => ({ ...prev, [id]: cleanedValue }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // 🚨 Alterado: Salva no Firestore
        const success = await saveBasePrices(editingPrices);

        if (success) {
            alert('Preços base salvos com sucesso no Firestore!');
        } else {
            alert('Erro ao salvar preços base. Verifique o console.');
        }
        setIsSaving(false);
    };

    if (loadingHook && Object.keys(basePrices).length === 0) {
        return (
            <div className="flex items-center justify-center p-8 bg-white rounded-xl shadow-xl min-h-[300px]">
                <RefreshCw className="w-6 h-6 text-yellow-500 animate-spin" />
                <p className="ml-2 text-gray-700">Carregando configurações...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 shadow-xl rounded-lg border-t-4 border-yellow-500">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-700">
                <DollarSign className="w-5 h-5 mr-2 text-yellow-500" />
                Configuração de Preços Base
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {INITIAL_ITEMS.map((item) => (
                    <div key={item.id} className="flex flex-col">
                        <label htmlFor={`price-${item.id}`} className="text-sm font-medium text-gray-600 mb-1 flex items-center">
                            <Package className="w-4 h-4 mr-1 text-blue-500" />
                            Preço Base - {item.description.split('(')[0].trim()}
                        </label>
                        <div className="flex items-center">
                            <span className="p-2 bg-gray-100 rounded-l-lg border border-gray-300 text-gray-600 text-sm">R$</span>
                            <input
                                id={`price-${item.id}`}
                                type="text"
                                value={editingPrices[item.id] || ''}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-r-lg focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 text-right"
                                placeholder="0,00"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center disabled:opacity-50"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-5 h-5 mr-2" />
                    )}
                    {/* 🚨 Alterado: Salvar Preços Base no Firestore */}
                    {isSaving ? 'Salvando...' : 'Salvar Preços Base no Firestore'}
                </button>
            </div>
            <p className="mt-4 text-xs text-gray-500 flex items-start">
                <AlertTriangle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-red-400" />
                Estes preços são persistentes (**Firestore**) e aplicados automaticamente.
            </p>
        </div>
    );
};

// Componente do Botão de WhatsApp (MANTIDO)
const WhatsappButton = ({ client, onGeneratePdf, isGenerating }) => {
    const nomeCliente = client.nome || 'Cliente';
    const telefone = client.telefone.replace(/\D/g, ''); 
    
    const whatsappMessage = `Olá ${nomeCliente}, aqui está o seu orçamento de Aquecimento Solar. Por favor, baixe o arquivo PDF gerado e anexe-o nesta conversa.`;
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(whatsappMessage)}`;

    const handleClick = () => {
        onGeneratePdf();
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1000); 
    };

    return (
        <button
            onClick={handleClick}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 flex items-center disabled:opacity-50"
            disabled={isGenerating || !client.telefone}
            title={!client.telefone ? "Preencha o telefone do cliente para enviar pelo WhatsApp" : "Gera o PDF e abre o WhatsApp (o usuário deve anexar o PDF)"}
        >
            {isGenerating ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
                <Send className="w-5 h-5 mr-2" /> 
            )}
            {isGenerating ? 'Gerando PDF...' : 'Enviar por WhatsApp'}
        </button>
    );
};


const BudgetView = React.forwardRef(({ client, items, totalValue, userId }, ref) => (
    <div ref={ref} data-userid={userId} className="budget-view p-8 bg-white shadow-xl rounded-lg print:shadow-none print:p-0">
        <div className="header-print text-center border-b-2 border-cyan-500 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-cyan-600 uppercase tracking-widest">A CASA DOS AQUECEDORES</h1>
            <p className="text-sm text-gray-600 mt-1">SOLAR, ELÉTRICO, GÁS E BOMBAS DE CALOR P/ PISCINAS.</p>
            <p className="text-xs text-gray-500 mt-2">FONE (15) 3227-3025 / (15) 99705-0935- SOROCABA/SP</p>
            <p className="text-xs text-gray-500">E-mail: casa.aquecedores@yahoo.com.hr</p>
        </div>

        <div className="client-info-print grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="col-span-2 text-lg font-bold text-blue-800 flex items-center mb-2 border-b border-blue-300 pb-1">
                <User className="text-sm text-gray-600 mt-1" /> DADOS DO CLIENTE
            </div>
            <div className="text-sm"><strong>Nome:</strong> {client.nome || '-'}</div>
            <div className="text-sm"><strong>Telefone:</strong> {client.telefone || '-'}</div>
            <div className="text-sm"><strong>E-mail:</strong> {client.email || '-'}</div>
            <div className="text-sm"><strong>Cidade:</strong> {client.cidade || '-'}</div>
            <div className="col-span-2 text-sm"><strong>Endereço:</strong> {client.endereco || '-'}</div>
        </div>

        <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-green-500 pb-1 inline-block">ORÇAMENTO DE AQUECIMENTO SOLAR - {new Date().toLocaleDateString('pt-BR')}</h2>
            <p className="text-sm text-gray-600 mt-1"></p>
        </div>

        <table className="items-table-print w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100 text-sm">
                    <th className="p-3 border-r">QTDE</th>
                    <th className="p-3 border-r">ITEM</th>
                    <th className="p-3 border-r text-right">VALOR UNITÁRIO</th>
                    <th className="p-3 text-right">VALOR TOTAL</th>
                </tr>
            </thead>
            <tbody>
                {items.filter(i => i.qty > 0).map((item) => (
                    <tr key={item.id} className="text-gray-700 hover:bg-gray-50 transition duration-100">
                        <td className="p-3 border-r font-medium text-center w-16">{item.qty.toFixed(0)}</td>
                        <td className="p-3 border-r">
                            <strong className="text-sm">{item.description.split('(')[0].trim()}</strong>
                            <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                        </td>
                        <td className="p-3 border-r text-right w-36 font-mono">{formatCurrency(item.unitPrice)}</td>
                        <td className="p-3 text-right w-36 font-bold text-green-600 font-mono">{formatCurrency(item.qty * item.unitPrice)}</td>
                    </tr>
                ))}
                <tr className="total-row-print bg-cyan-100 font-bold text-cyan-800">
                    <td colSpan="3" className="p-3 text-right text-md border-r-0">TOTAL GERAL</td>
                    <td className="p-3 text-right text-md border-l-0">{formatCurrency(totalValue)}</td>
                </tr>
            </tbody>
        </table>

        <div className="notes-print mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
                <h3 className="font-bold text-sm uppercase text-green-600 mb-2 border-b border-green-300 pb-1 flex items-center">
                    <Ruler className="w-4 h-4 mr-1"/>
                    GARANTIAS
                </h3>
                <ul className="text-gray-600 list-disc list-inside space-y-1 text-sm">
                    <li>03 ANOS P/ RESERVATÓRIO (BOILER)</li>
                    <li>03 ANOS P/ COLETORES SOLAR</li>
                    <li>01 ANO P/ PRESSURIZADORES</li>
                    <li>03 MESES P/ TERMOSTATO, RESISTÊNCIA</li>
                    <li className="mt-2 text-red-500">A garantia não cobre intempéries da natureza.</li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-sm uppercase text-green-600 mb-2 border-b border-green-300 pb-1 flex items-center">
                    <Clock className="w-4 h-4 mr-1"/>
                    CONDIÇÕES GERAIS
                </h3>
                <ul className="text-gray-600 list-disc list-inside space-y-1 text-sm">
                    <li><strong className="font-semibold">CONDIÇÕES DE PAGAMENTO:</strong> À COMBINAR</li>
                    <li><strong className="font-semibold">PRAZO DE ENTREGA:</strong> 10 DIAS ÚTEIS, após confirmação do pedido.</li>
                    <li className="mt-2 font-semibold">OBS: ORÇAMENTO SUJEITO À ALTERAÇÕES</li>
                    <li>Válido até: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}</li>
                </ul>
            </div>
        </div>

        <div className="footer-print text-center mt-12 pt-6 border-t border-gray-300 text-gray-600">
            <p className="font-semibold text-sm">Roseli Sepulveda</p>
            <p className="font-semibold text-sm">(15) 99705-0935</p>
            <p className='text-xs mt-1'>Data: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <style>
            {`
            @media print {
                /* Estilos específicos para impressão */
                .no-print { display: none !important; }
                .budget-view { box-shadow: none !important; padding: 0 !important; }
                .client-info-print { grid-template-columns: 1fr 1fr; }
                .notes-print { grid-template-columns: 1fr 1fr; }
            }
            `}
        </style>
    </div>
));


// --- COMPONENTE PRINCIPAL: App (Orquestrador) ---
const App = () => {
    // 1. Usa o Hook para obter todo o estado e lógica
    const {
        loading,
        userId,
        isAuthReady,
        client,
        items,
        totalValue,
        basePrices,
        handleClientChange,
        handleItemChange,
        saveBasePrices,
        saveBudget,
    } = useBudget();

    const budgetRef = useRef(null);
    const [isSavingBudget, setIsSavingBudget] = useState(false);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); 

    // 2. Handlers de Ação

    // Função para gerar o PDF e forçar o download (MANTIDA)
    const generateAndDownloadPdf = useCallback(async (isSilent = false) => {
        if (!budgetRef.current) return;

        const html2pdf = (await import('html2pdf.js')).default;

        setIsGeneratingPdf(true);
        const nomeArquivo = `Orcamento_Solar_${client.nome.replace(/ /g, '_') || 'Cliente'}_${new Date().toISOString().substring(0, 10)}.pdf`;

        const options = {
            margin: 10,
            filename: nomeArquivo,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: false, scrollY: 0, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(options).from(budgetRef.current).save();
            if (!isSilent) {
                 alert('PDF gerado e baixado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            alert('Erro ao gerar o PDF. Verifique o console. (Certifique-se de que está no navegador)');
        } finally {
            setIsGeneratingPdf(false);
        }
    }, [client.nome]); 


    // Handler de Impressão (MANTIDO)
    const handlePrint = () => {
         if (budgetRef.current) {
            const printContents = budgetRef.current.outerHTML;
            const printWindow = window.open('', '_blank');

            printWindow.document.write(`
                <html>
                <head>
                    <title>Orçamento Solar</title>
                    <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Roboto+Mono:wght@400;700&display=swap');
                    body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; color: #1f2937; }
                    .budget-view { max-width: 800px; margin: 0 auto; }
                    .header-print h1 { font-size: 24px !important; }
                    .total-row-print td { background-color: #DBEAFE !important; color: #06B6D4 !important; }
                    </style>
                </head>
                <body class="p-8">
                    ${printContents}
                    <script>
                    setTimeout(() => {
                        window.print();
                        window.onafterprint = function() {
                        window.close();
                        };
                    }, 500);
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };


    const handleSaveBudget = async () => {
        setIsSavingBudget(true);
        // 🚨 Alterado: Salva no Firestore e recebe o ID
        const docId = await saveBudget(); 
        if (docId) {
            alert(`Orçamento salvo com sucesso no Firestore! ID: ${docId}`);
        } else {
            alert('Erro ao salvar o orçamento. Verifique o console.');
        }
        setIsSavingBudget(false);
    };
    
    // Simplificando o loading, pois o local é rápido
    if (loading && !isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-xl">
                    <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="mt-4 text-gray-700 font-medium">Carregando aplicação...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Cabeçalho */}
                <div className="bg-cyan-600 text-white p-6 rounded-xl shadow-2xl">
                    <h1 className="text-3xl font-extrabold flex items-center">
                        <Sun className="w-8 h-8 mr-3 text-yellow-300" />
                        A Casa dos Aquecedores
                    </h1>
                    {/* 🚨 Alterado: Indica Salvamento em Nuvem */}
                    <p className="mt-1 text-cyan-100">Salvamento em Nuvem (Firestore).</p> 
                </div>

                {/* Colunas: Formulário de Edição vs. Preços Base */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* 1. Dados do Cliente (Componente ClientForm) */}
                        <ClientForm client={client} handleClientChange={handleClientChange} />

                        {/* 2. Itens do Orçamento (Componente ItemTable) */}
                        <ItemTable items={items} handleItemChange={handleItemChange} totalValue={totalValue} />

                        {/* Ações */}
                        <div className="flex justify-end space-x-4 no-print">
                            {/* BOTÃO DE WHATSAPP (MANTIDO) */}
                            <WhatsappButton 
                                client={client} 
                                onGeneratePdf={() => generateAndDownloadPdf(true)} 
                                isGenerating={isGeneratingPdf}
                            />
                            
                            <button
                                onClick={handleSaveBudget}
                                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 flex items-center disabled:opacity-50"
                                disabled={isSavingBudget || isGeneratingPdf}
                            >
                                {isSavingBudget ? (
                                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5 mr-2" />
                                )}
                                {/* 🚨 Alterado: Salvar Orçamento (Firestore) */}
                                {isSavingBudget ? 'Salvando...' : 'Salvar Orçamento (Firestore)'} 
                            </button>
                            <button
                                onClick={handlePrint}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-200 flex items-center disabled:opacity-50"
                                disabled={isGeneratingPdf}
                            >
                                <Printer className="w-5 h-5 mr-2" />
                                Imprimir / Gerar PDF
                            </button>
                        </div>
                    </div>

                    {/* Configuração de Preços Base (Componente PriceSettings) */}
                    <div className="lg:col-span-1 no-print">
                        <PriceSettings 
                            userId={userId} 
                            isAuthReady={isAuthReady} 
                            basePrices={basePrices} 
                            saveBasePrices={saveBasePrices}
                            loadingHook={loading}
                        />
                    </div>
                </div>
                
                {/* 3. Visualização do Orçamento para Impressão */}
                <h2 className="text-2xl font-bold pt-8 border-t-2 mt-8 flex items-center text-gray-700">
                    <ArrowRight className="w-5 h-5 mr-2 text-cyan-500"/>
                    Pré-visualização do Orçamento
                </h2>
                <div className="p-4 bg-gray-100 rounded-xl shadow-inner">
                    <BudgetView 
                        ref={budgetRef} 
                        client={client} 
                        items={items} 
                        totalValue={totalValue} 
                        userId={userId} 
                    />
                </div>
            </div>
        </div>
    );
};

export default App;