import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShipments } from '../../contexts/ShipmentContext';
import { ROUTES } from '../../routes';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { shipments } = useShipments();
    const [selectedShipmentId, setSelectedShipmentId] = useState('');

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
            navigate(ROUTES.home);
            return;
        }

        navigate(ROUTES.shipment(encodeURIComponent(shipmentId)));
    };

    return (
        <header className="app-header">
            <div className="app-header__left">
                <button type="button" className="app-header__button" onClick={() => navigate(ROUTES.home)}>
                    Graph
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate(ROUTES.createNode)}>
                    Add Node
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate(ROUTES.createEdge)}>
                    Add Edge
                </button>
                <button type="button" className="app-header__button" onClick={() => navigate(ROUTES.createShipment)}>
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