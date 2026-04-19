export const ROUTES = {
    home: '/',
    error: '/error',
    createNode: '/createNode',
    createEdge: '/createEdge',
    createShipment: '/createShipment',
    node: (nodeId = ':nodeid') => `/node/${nodeId}`,
    edge: (edgeId = ':edgeid') => `/edge/${edgeId}`,
    shipment: (shipmentId = ':shipmentid') => `/shipment/${shipmentId}`,
};
