//const BASE_URL = 'http://localhost:3000/api/resources';
const BASE_URL = 'httpsgit add .://disaster-app-backend-disasters-app-dev.apps-crc.testing/api/resources';
export async function getResources() {
    const res = await fetch(BASE_URL);
    return res.json();
}

export async function addResource(resource) {
    await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
    });
}
export async function updateResource(resource) {
    const res = await fetch(`${BASE_URL}/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
    });
    return res.json(); // returns updated resource
}
export async function getResourceDetails(id) {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
}

export async function assignResource(data) {
    await fetch(`${BASE_URL}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}