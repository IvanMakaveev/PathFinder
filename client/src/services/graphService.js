import { request } from './apiClient';

const url = process.env.REACT_APP_API_URL + 'graph/';

export const getGraphData = () => {
    return request(url, {}, {
        responseType: 'json',
        fallbackErrorMessage: 'Unable to load graph data.',
    });
};