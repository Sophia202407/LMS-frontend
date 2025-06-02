const API_URL = 'http://localhost:8080/api/loans';

export async function getLoans() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error('Failed to fetch loans:', error);
        return [];
    }
}

export async function getLoan(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
        return await res.json();
    } catch (error) {
        console.error(`Failed to fetch loan ${id}:`, error);
        return null;
    }
}

export async function createLoan(loan) {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loan),
        });
        if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
        }
        return await res.json();
    } catch (error) {
        console.error('Failed to create loan:', error);
        throw error;
    }
}

export async function deleteLoan(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    } catch (error) {
        console.error(`Failed to delete loan ${id}:`, error);
    }
}