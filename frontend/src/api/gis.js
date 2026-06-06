import axios from 'axios';

//const API = 'http://localhost:3000/api/gis';
const API = 'https://disaster-app-backend-disasters-app-dev.apps-crc.testing/api/gis';

export async function getIncidents() {
    const res = await axios.get(`${API}/disasters`);
    return res.data;
}

export async function getShelters() {
    const res = await axios.get(`${API}/shelters`);
    return res.data;
}

export async function getResources() {
    const res = await axios.get(`${API}/resources`);
    return res.data;
}

export async function getBlockedRoutes() {
    const res = await axios.get(`${API}/blocked-routes`);
    return res.data;
}

