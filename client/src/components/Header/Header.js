import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as shipmentService from '../../services/shipmentService';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [shipments, setShipments] = useState([]);
    const [selectedShipmentId, setSelectedShipmentId] = useState('');

    useEffect(() => {
        shipmentService.getShipments().then((data) => {
            const options = Array.isArray(data) ? data : [];
            setShipments(options);
        });
    }, []);

    useEffect(() => {
        const handleShipmentCreated = (event) => {
            const created = event?.detail;
            const createdId = created?.id;
            const createdName = created?.name;

            if (createdId == null || createdName == null || createdName === '') {
                return;
            }

            const idAsString = String(createdId);

            setShipments((prev) => {
                const exists = prev.some((shipment) => String(shipment.id ?? '') === idAsString);
                if (exists) {
                    return prev;
                }

                return [...prev, { id: createdId, name: createdName }];
            });
        };

        window.addEventListener('shipment-created', handleShipmentCreated);

        return () => {
            window.removeEventListener('shipment-created', handleShipmentCreated);
        };
    }, []);

    useEffect(() => {
        const match = location.pathname.match(/^\/shipment\/([^/]+)$/);

        if (match && match[1]) {
            setSelectedShipmentId(decodeURIComponent(match[1]));
            return;
        }

        setSelectedShipmentId('');
    }, [location.pathname]);

    const handleShipmentChange = (event) => {
        const shipmentId = event.target.value;
        setSelectedShipmentId(shipmentId);

        if (shipmentId === '') {
            navigate('/');
            return;
        }

        navigate(`/shipment/${encodeURIComponent(shipmentId)}`);
    };

    return (
        <header className="app-header">
            <div className="app-header__left">
                <button type="button" className="app-header__button" onClick={() => navigate('/')}>
                    Graph
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate('/createNode')}>
                    Add Node
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate('/createEdge')}>
                    Add Edge
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate('/createShipment')}>
                    Add Shipment
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
                        const value = String(shipment.id ?? '');
                        const label = shipment.name ?? `Shipment ${value}`;

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