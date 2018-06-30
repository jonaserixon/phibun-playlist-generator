export function requestOptions(access_token, method) {
    let options = {
        body: access_token,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method,
        json: true
    };

    return options;
}
