import { authHeader } from './authHeader';

//const BASE_URL = 'http://localhost:3000/api/tasks';
const BASE_URL = 'https://disaster-app-backend-disasters-app-dev.apps-crc.testing/api/tasks';
export async function getMyTasks() {
    const res = await fetch(`${BASE_URL}/me`, {
        headers: {
            ...authHeader()
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return res.json();
}

export async function updateTaskStatus(taskId, status) {
    const res = await fetch(`${BASE_URL}/${taskId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify({ status })
    });

    if (!res.ok) {
        throw new Error('Failed to update task');
    }

    return res.json();
}
export async function getTasks(volunteerId) {
    if (!volunteerId) return [];

    const res = await fetch(`${BASE_URL}/${volunteerId}`, {
        headers: {
            ...authHeader()
        }
    });

    if (!res.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return res.json();
}

// Optional: mark task as completed
export async function completeTask(taskId) {
    await fetch(`${BASE_URL}/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
    });
}

export async function getTasksByDisaster(disasterId) {
    const res = await fetch(`${BASE_URL}?disaster_id=${disasterId}`,{
        headers: {
            ...authHeader()}
        });
    return res.json();
}

export async function assignVolunteerToTask(taskId, volunteerId) {
    const res = await fetch(`${BASE_URL}/${taskId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_id: volunteerId })
    });
    return res.json();
}

