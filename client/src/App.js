import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ErrorPage from './components/ErrorPage';
import NodePage from './components/NodePage';
import EdgePage from './components/EdgePage';
import ShipmentPage from './components/ShipmentPage';
import CreateNode from './components/CreateNode';
import CreateEdge from './components/CreateEdge';
import CreateShipment from './components/CreateShipment';
import { ShipmentProvider } from './contexts/ShipmentContext';
import { ROUTES } from './routes';

function App() {

    return (
        <div className="App">
            <main className="app-main">
                <BrowserRouter>
                    <ShipmentProvider>
                        <Header />
                        <Routes>
                            <Route path={ROUTES.home} element={<HomePage />} />
                            <Route path={ROUTES.createNode} element={<CreateNode />} />
                            <Route path={ROUTES.createEdge} element={<CreateEdge />} />
                            <Route path={ROUTES.createShipment} element={<CreateShipment />} />
                            <Route path={ROUTES.shipment()} element={<ShipmentPage />} />
                            <Route path={ROUTES.error} element={<ErrorPage />} />
                            <Route path={ROUTES.node()} element={<NodePage />} />
                            <Route path={ROUTES.edge()} element={<EdgePage />} />
                        </Routes>
                    </ShipmentProvider>
                </BrowserRouter>
            </main>
        </div>
    );
}
export default App;
