import fetch from "node-fetch";

// export async function zoomGetAccessToken() {
//     const formData = new URLSearchParams({
//         "grant_type": "account_credentials",
//         "account_id": process.env.ZOOM_ACCOUNT_ID,
//       });

//       return 'https://zoom.us/oauth/token' + "?" + formData.toString()
// }

export async function zoomGetAccessToken() {
    const accountId = process.env.ZOOM_ACCOUNT_ID;
    const clientId = process.env.ZOOM_CLIENT_ID;
    const clientSecret = process.env.ZOOM_CLIENT_SECRET;
    console.log('clientId', clientId);
    console.log('clientSecret', clientSecret);

    const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`;
    const basicAuth = zoomCreateAuthorization(clientId, clientSecret);
    console.log('basicAuth', basicAuth)

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Host': 'zoom.us',
            'Authorization': `Basic ${basicAuth}`,
        },
    });
    console.log('response', response)
    return response
}


export function zoomCreateAuthorization(client_id: string, client_secret: string) {
    return Buffer.from(`${client_id}:${client_secret}`).toString('base64');
}

// function btoa(_arg0: string) {
//     throw new Error("Function not implemented.");
// }


// function fetch(_url: string, _arg1: { method: string; headers: { Authorization: string; 'Content-Type': string; }; }) {
//     throw new Error("Function not implemented.");
// }
