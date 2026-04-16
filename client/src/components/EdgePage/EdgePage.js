import React from 'react';
import Graph from '../Graph';
import SidePanel from '../SidePanel';
import './EdgePage.css';

const EdgePage = () => {
    return (
        <section className="edge-page">
            <div className="edge-page__graph-shell">
                <Graph />
            </div>
            <SidePanel kind="Edge" />
        </section>
    );
};

export default EdgePage;