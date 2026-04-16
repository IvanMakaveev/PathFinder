import React from 'react';
import { useParams } from 'react-router-dom';
import './SidePanel.css';

const SidePanel = ({ kind }) => {
    const params = useParams();
    const id = params.nodeid ?? params.edgeid;

    return (
        <aside className="side-panel">
            <h2 className="side-panel__title">{kind} Details</h2>
            <p className="side-panel__text">Selected ID: {id}</p>
            <p className="side-panel__hint">This panel is reserved for the menu/component you will add later.</p>
        </aside>
    );
};

export default SidePanel;