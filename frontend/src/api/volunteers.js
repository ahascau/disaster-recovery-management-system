import { authHeader } from './authHeader';
//const BASE_URL = 'http://localhost:3000/api/volunteers';
const BASE_URL = 'https://disaster-app-backend-disasters-app-dev.apps-crc.testing/api/volunteers';


export async function getVolunteers() {
    const res = await fetch(BASE_URL, {
        headers: {
            ...authHeader()
        }
    });

    if (!res.ok) throw new Error('Failed to fetch volunteers');

    return res.json();
}

export async function addVolunteer(volunteer) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(volunteer)
    });

    if (!res.ok) throw new Error('Failed to add volunteer');
}

export async function getVolunteerById(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        headers: {
            ...authHeader()
        }
    });

    if (!res.ok) throw new Error('Volunteer not found');

    return res.json();
}
