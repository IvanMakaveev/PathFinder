const url = process.env.REACT_APP_API_URL + 'nodes/';

export const getNodeDetails = (nodeId) => {
    return fetch(`${url}${nodeId}`)
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

export const getNodeModifiers = (nodeId) => {
    return fetch(`${url}${nodeId}/modifiers`)
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
            else {
                return undefined;
            }
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
            else {
                return undefined;
            }
        })
        .catch((res) => {
            console.log(res);
        });
};