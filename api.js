export const baseUrl = 'http://localhost:3000';

async function handleRequest(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();
    const data = await text ? JSON.parse(text) : {};
    if (!response.ok) {
        throw new Error(JSON.stringify({res: Number(response.status), message: data.message}));
    }
    return data;
}

export async function getUsers() {
    return handleRequest(`${baseUrl}/users`);
}

export async function createUser(user) {
    return handleRequest(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

export async function updateUser(id, user) {
    return handleRequest(`${baseUrl}/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
}

export async function deleteUser(id) {
    return handleRequest(`${baseUrl}/users/${id}`, {
        method: 'DELETE'
    });
}

export async function uploadProfilePicture(id, file) {
    const formData = new FormData();
    formData.append('file', file);

    return handleRequest(`${baseUrl}/users/${id}/profile`, {
        method: 'PUT',
        body: formData
    });
}