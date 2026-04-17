const url = process.env.REACT_APP_API_URL + 'shipments/';

export const createShipment = (shipmentData) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
    })
        .then(async (res) => {
            if (res.ok == true) {
                const responseText = await res.text().catch(() => '');
                if (responseText == null || responseText === '') {
                    return { ok: true };
                }

                try {
                    const parsed = JSON.parse(responseText);
                    if (typeof parsed === 'number') {
                        return { ok: true, id: parsed };
                    }

                    if (typeof parsed === 'object' && parsed != null) {
                        const parsedId = parsed.id ?? parsed.shipmentId;
                        if (typeof parsedId === 'number' || typeof parsedId === 'string') {
                            return { ok: true, id: Number(parsedId) };
                        }
                    }
                }
                catch {
                    const maybeNumber = Number(responseText);
                    if (Number.isFinite(maybeNumber)) {
                        return { ok: true, id: maybeNumber };
                    }
                }

                return { ok: true };
            }

            const errorData = await res.json().catch(() => undefined);
            return { ok: false, errorData };
        })
        .catch((res) => {
            console.log(res);
        });
};

export const getShipments = () => {
    return fetch(url)
        .then((res) => {
            if (res.ok == true) {
                return res.json();
            }
            return [];
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
            return undefined;
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
            return undefined;
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
            return undefined;
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
            return undefined;
        })
        .catch((res) => {
            console.log(res);
        });
};