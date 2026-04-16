const url = process.env.REACT_APP_API_URL + 'graph/';

export const getGraphData = (token) => {
    return fetch(url)
        .then(res => {
            if (res.ok == true) {
                return res.json();
            }
            else {
                return undefined;
            }
        })
        .catch(res => {
            console.log(res);
        });
}