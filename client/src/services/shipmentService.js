import { request } from './apiClient';

const url = process.env.REACT_APP_API_URL + 'shipments/';

export const createShipment = (shipmentData) => {
    return request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
    }, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to create shipment.',
    }).then((result) => {
        if (!result.ok) {
            return result;
        }

        const payload = result.data;
        let id;

        if (typeof payload === 'number' || typeof payload === 'string') {
            id = Number(payload);
        }
        else if (payload && typeof payload === 'object') {
            id = Number(payload.id ?? payload.shipmentId);
        }

        return {
            ...result,
            data: {
                id: Number.isFinite(id) ? id : undefined,
            },
        };
    });
};

export const getShipments = () => {
    return request(url, {}, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to load shipments.',
    });
};

export const getShipmentDetails = (shipmentId) => {
    return request(`${url}${shipmentId}`, {}, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to load shipment details.',
    });
};

export const getShipmentConstraint = (shipmentId) => {
    return request(`${url}${shipmentId}/constraint`, {}, {
        responseType: 'text',
        fallbackErrorMessage: 'Unable to load shipment constraint.',
    }).then((result) => {
        if (!result.ok) {
            return result;
        }

        const text = result.data ?? '';
        if (text === '') {
            return {
                ...result,
                data: '',
            };
        }

        try {
            const parsed = JSON.parse(text);
            return {
                ...result,
                data: typeof parsed === 'string' ? parsed : JSON.stringify(parsed),
            };
        }
        catch {
            return result;
        }
    });
};

export const findShipmentPath = (shipmentId) => {
    return request(`${url}${shipmentId}/path`, {}, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to find shipment path.',
    });
};

export const editShipmentConstraint = (shipmentId, constraintJson) => {
    return request(`${url}${shipmentId}/constraint`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(constraintJson),
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to save constraint JSON.',
    });
};

export const deleteShipmentConstraint = (shipmentId) => {
    return request(`${url}${shipmentId}/constraint`, {
        method: 'DELETE',
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to delete constraint JSON.',
    });
};