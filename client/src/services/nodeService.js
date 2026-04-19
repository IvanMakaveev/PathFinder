import { request } from './apiClient';

const url = process.env.REACT_APP_API_URL + 'nodes/';

export const getAllNodes = () => {
    return request(url, {}, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to load nodes.',
    });
};

export const getNodeDetails = (nodeId) => {
    return request(`${url}${nodeId}`, {}, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to load node details.',
    });
};

export const getNodeModifiers = (nodeId) => {
    return request(`${url}${nodeId}/modifiers`, {}, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to load node modifiers.',
    });
};

export const addNodeModifier = (nodeId, modifierType, value) => {
    return request(`${url}${nodeId}/modifiers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ModifierType: modifierType,
            Value: value,
        }),
    }, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to add modifier.',
    });
};

export const deleteNodeModifier = (modifierId) => {
    return request(`${url}modifiers/${modifierId}`, {
        method: 'DELETE',
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to delete modifier.',
    });
};

export const editNodeType = (nodeId, nodeType) => {
    return request(`${url}${nodeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeType }),
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to update node type.',
    });
};

export const deleteNode = (nodeId) => {
    return request(`${url}${nodeId}`, {
        method: 'DELETE',
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to delete node.',
    });
};

export const createNode = (nodeData) => {
    return request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeData),
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to create node.',
    });
};