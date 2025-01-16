
export const login = async (username, password) => {
    const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error(data.message || 'Login failed');
    }
};
