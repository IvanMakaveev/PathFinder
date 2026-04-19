import { request } from './apiClient';

const url = process.env.REACT_APP_API_URL + 'edges/';

export const createEdge = (edgeData) => {
    return request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edgeData),
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to create edge.',
    });
};

export const getEdgeDetails = (edgeId) => {
    return request(url + encodeURIComponent(edgeId), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to load edge details.',
    });
};

export const deleteEdge = (edgeId) => {
    return request(url + encodeURIComponent(edgeId), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to delete edge.',
    });
};

export const editEdgeLength = (edgeId, length) => {
    return request(url + encodeURIComponent(edgeId), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ length }),
    }, {
        responseType: 'none',
        fallbackErrorMessage: 'Unable to update edge length.',
    });
};
