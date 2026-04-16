const url = process.env.REACT_APP_API_URL + 'shipments/';

export const getShipments = () => {
    return fetch(url)
        .then((res) => {
            if (res.ok == true) {
                return res.json();
            }
            else {
                return [];
            }
        })
        .catch((res) => {
            console.log(res);
            return [];
        });
};

export const getShipmentDetails = (shipmentId) => {
    return fetch(`${url}${shipmentId}`)
        .then((res) => {
            if (res.ok == true) {
                return res.json();
            }
            else {
                return undefined;
            }
        })
        .catch((res) => {
            console.log(res);
        });
};

export const getShipmentConstraint = (shipmentId) => {
    return fetch(`${url}${shipmentId}/constraint`)
        .then((res) => {
            if (res.ok == true) {
                return res.text().then((text) => {
                    if (text == null || text === '') {
                        return '';
                    }

                    try {
                        const parsed = JSON.parse(text);
                        return typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
                    }
                    catch {
                        return text;
                    }
                });
            }
            else {
                return undefined;
            }
        })
        .catch((res) => {
            console.log(res);
        });
};

export const findShipmentPath = (shipmentId) => {
    return fetch(`${url}${shipmentId}/path`)
        .then((res) => {
            if (res.ok == true) {
                return res.json();
            }
            else {
                return undefined;
            }
        })
        .catch((res) => {
            console.log(res);
        });
};

export const editShipmentConstraint = (shipmentId, constraintJson) => {
    return fetch(`${url}${shipmentId}/constraint`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(constraintJson),
    })
        .then((res) => {
            if (res.ok == true) {
                return true;
            }
            else {
                return undefined;
            }
        })
        .catch((res) => {
            console.log(res);
        });
};

export const deleteShipmentConstraint = (shipmentId) => {
    return fetch(`${url}${shipmentId}/constraint`, {
        method: 'DELETE',
    })
        .then((res) => {
            if (res.ok == true) {
                return true;
            }
            else {
                return undefined;
            }
        })
        .catch((res) => {
            console.log(res);
        });
};