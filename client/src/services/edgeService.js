const url = process.env.REACT_APP_API_URL + 'edges/';

export const createEdge = (edgeData) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edgeData),
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

export const getEdgeDetails = (edgeId) => {
    return fetch(url + encodeURIComponent(edgeId), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
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

export const deleteEdge = (edgeId) => {
    return fetch(url + encodeURIComponent(edgeId), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
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
