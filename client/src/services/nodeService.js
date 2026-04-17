const url = process.env.REACT_APP_API_URL + 'nodes/';

export const getAllNodes = () => {
    return fetch(url)
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

export const getNodeDetails = (nodeId) => {
    return fetch(`${url}${nodeId}`)
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

export const getNodeModifiers = (nodeId) => {
    return fetch(`${url}${nodeId}/modifiers`)
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

export const addNodeModifier = (nodeId, modifierType, value) => {
    return fetch(`${url}${nodeId}/modifiers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ModifierType: modifierType,
            Value: value,
        }),
    })
        .then(async (res) => {
            if (res.ok == true) {
                const json = await res.json().catch(() => undefined);
                return { ok: true, data: json };
            }

            const errorData = await res.json().catch(() => undefined);
            return { ok: false, errorData };
        })
        .catch((res) => {
            console.log(res);
        });
};

export const deleteNodeModifier = (modifierId) => {
    return fetch(`${url}modifiers/${modifierId}`, {
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

export const editNodeType = (nodeId, nodeType) => {
    return fetch(`${url}${nodeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodeType }),
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

export const deleteNode = (nodeId) => {
    return fetch(`${url}${nodeId}`, {
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

export const createNode = (nodeData) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeData),
    })
        .then(async (res) => {
            if (res.ok == true) {
                return { ok: true };
            }

            const errorData = await res.json().catch(() => undefined);
            return { ok: false, errorData };
        })
        .catch((res) => {
            console.log(res);
        });
};