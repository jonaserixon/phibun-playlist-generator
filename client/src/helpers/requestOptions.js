export function requestOptions(data, method) {
    let options = {
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method,
        json: true
    };

    return options;
}
