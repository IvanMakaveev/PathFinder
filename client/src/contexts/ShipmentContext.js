import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as shipmentService from '../services/shipmentService';

const ShipmentContext = createContext(undefined);

export const ShipmentProvider = ({ children }) => {
    const [shipments, setShipments] = useState([]);

    const refreshShipments = useCallback(async () => {
        const result = await shipmentService.getShipments();
        if (!result.ok) {
            return;
        }

        const options = Array.isArray(result.data) ? result.data : [];
        setShipments(options);
    }, []);

    const addShipment = useCallback((shipment) => {
        const shipmentId = shipment?.id;
        if (shipmentId == null) {
            return;
        }

        const idAsString = String(shipmentId);

        setShipments((prev) => {
            const exists = prev.some((item) => String(item.id ?? '') === idAsString);
            if (exists) {
                return prev;
            }

            return [...prev, shipment];
        });
    }, []);

    useEffect(() => {
        refreshShipments();
    }, [refreshShipments]);

    const value = useMemo(() => ({
        shipments,
        refreshShipments,
        addShipment,
    }), [shipments, refreshShipments, addShipment]);

    return (
        <ShipmentContext.Provider value={value}>
            {children}
        </ShipmentContext.Provider>
    );
};

export const useShipments = () => {
    const context = useContext(ShipmentContext);
    if (!context) {
        throw new Error('useShipments must be used within ShipmentProvider');
    }

    return context;
};
