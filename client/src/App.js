import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ErrorPage from './components/ErrorPage';
import NodePage from './components/NodePage';
import EdgePage from './components/EdgePage';

function App() {

    return (
        <div className="App">
            <main className="app-main">
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/error" element={<ErrorPage />} />
                        <Route path="/node/:nodeid" element={<NodePage />} />
                        <Route path="/edge/:edgeid" element={<EdgePage />} />
                    </Routes>
                </BrowserRouter>
            </main>
        </div>
    );
}
export default App;
