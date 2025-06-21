
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import UploadForm from './components/UploadForm.js';
import ListForm from './components/ListForm.js';
import RouteDetails from './components/RouteDetails.js';
import RegisterDriver from './components/RegisterDriver.js';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import './index.css';

const PageWrapper = ({ children }) => {
    const location = useLocation();
    const titles = {
        '/': 'Upload de Rota',
        '/rotas': 'Lista de Rotas',
        '/registrar-condutor': 'Registro de Motoristas'
    };
    const title = titles[location.pathname] || 'Painel';

    return (
        <div style={{ marginLeft: '240px', minHeight: '100vh', background: '#121212' }}>
            <Header title={title} />
            <div style={{ padding: '30px' }}>
                {children}
            </div>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Sidebar />
            <PageWrapper>
                <Routes>
                    <Route path="/" element={<UploadForm />} />
                    <Route path="/rotas" element={<ListForm />} />
                    <Route path="/rota/:id" element={<RouteDetails />} />
                    <Route path="/registrar-condutor" element={<RegisterDriver />} />
                </Routes>
            </PageWrapper>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
