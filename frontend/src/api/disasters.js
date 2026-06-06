//const BASE_URL = 'http://localhost:3000/api/disasters';
const BASE_URL = 'https://disaster-app-backend-disasters-app-dev.apps-crc.testing/api/disasters';
export async function getDisasters() {
    const res = await fetch(BASE_URL);
    return res.json();
}

export async function addDisaster(disaster) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disaster)
    });
    return res.json();
}

export async function updateDisaster(id, disaster) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(disaster)
    });
    return res.json();
}

export async function deleteDisaster(id) {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return res.json();
}
