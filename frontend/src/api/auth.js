//const BASE_URL = 'http://localhost:3000/api/auth';

const BASE_URL = 'https://disaster-app-backend-disasters-app-dev.apps-crc.testing/api/auth';

export async function login(email, password) {
    const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        throw new Error('Invalid credentials');
    }

    return res.json(); // returns { token }
}