export function setAuth(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('userId', data.id);

    window.dispatchEvent(new Event('authChange'));
}

export function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');

    window.dispatchEvent(new Event('authChange'));
}