import React from 'react';
import Graph from '../Graph';
import './HomePage.css';

const HomePage = () => {
    return (
        <section className="home-page">
            <div className="home-page__graph-shell">
                <Graph />
            </div>
        </section>
    );
};

export default HomePage;