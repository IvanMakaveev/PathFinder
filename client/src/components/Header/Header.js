import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as shipmentService from '../../services/shipmentService';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [shipments, setShipments] = useState([]);
    const [selectedShipmentId, setSelectedShipmentId] = useState('');

    useEffect(() => {
        shipmentService.getShipments().then((data) => {
            const options = Array.isArray(data) ? data : [];
            setShipments(options);
        });
    }, []);

    const handleShipmentChange = (event) => {
        const shipmentId = event.target.value;
        setSelectedShipmentId(shipmentId);

        if (shipmentId !== '') {
            navigate(`/shipment/${encodeURIComponent(shipmentId)}`);
        }
    };

    return (
        <header className="app-header">
            <div className="app-header__left">
                <button type="button" className="app-header__button" onClick={() => navigate('/')}>
                    Home
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate('/node/1')}>
                    Node Sample
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate('/edge/1')}>
                    Edge Sample
                </button>
            </div>

            <div className="app-header__right">
                <label className="app-header__label" htmlFor="shipment-select">
                    Shipment
                </label>
                <select
                    id="shipment-select"
                    className="app-header__select"
                    value={selectedShipmentId}
                    onChange={handleShipmentChange}
                >
                    <option value="">Select shipment</option>
                    {shipments.length === 0 && <option value="" disabled>No shipments</option>}
                    {shipments.map((shipment) => {
                        const value = String(shipment.id ?? shipment.value ?? '');
                        const label = shipment.name ?? shipment.label ?? `Shipment ${value}`;

                        return (
                            <option key={value || label} value={value}>
                                {label}
                            </option>
                        );
                    })}
                </select>
            </div>
        </header>
    );
};

export default Header;