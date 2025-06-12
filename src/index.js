import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UploadForm from './components/UploadForm.js';
import ListForm from './components/ListForm.js';
import RouteDetails from './components/RouteDetails.js';
import RegisterDriver from './components/RegisterDriver.js';
import Navbar from './components/NavBar.js';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<UploadForm />} />
                <Route path="/rotas" element={<ListForm />} />
                <Route path="/rota/:id" element={<RouteDetails />} />
                <Route path="/registrar-condutor" element={<RegisterDriver />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
