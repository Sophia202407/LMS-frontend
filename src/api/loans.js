const API_BASE_URL = 'http://localhost:8080/api/loans';

// Simple function to get common headers
const getHeaders = () => ({
    'Content-Type': 'application/json'
});

// Get all loans - simplified for small project
export async function getLoans() {
    try {
        const endpoint = `${API_BASE_URL}/all`;
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching loans:', error);
        throw new Error(error.message || 'Failed to fetch loans');
    }
}

// Get single loan by ID
export async function getLoan(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching loan ${id}:`, error);
        throw new Error(error.message || 'Failed to fetch loan');
    }
}

// Create new loan
export async function createLoan(loanData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(loanData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating loan:', error);
        throw new Error(error.message || 'Failed to create loan');
    }
}

// Get loans for the current authenticated user
export async function getMyLoans() {
    try {
        // Correctly target the /my-loans endpoint
        const endpoint = `${API_BASE_URL}/my-loans`; 
        
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: getHeaders(),
            credentials: 'include' // Important for sending cookies/session with authentication
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching my loans:', error);
        throw new Error(error.message || 'Failed to fetch my loans');
    }
}

// Delete loan (librarian only)
export async function deleteLoan(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        // DELETE returns no content, so don't try to parse JSON
        return true;
    } catch (error) {
        console.error(`Error deleting loan ${id}:`, error);
        throw new Error(error.message || 'Failed to delete loan');
    }
}

// Renew loan
export async function renewLoan(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/renew`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error renewing loan:', error);
        throw new Error(error.message || 'Failed to renew loan');
    }
}

// Return loan
export async function returnLoan(id) {
    try {
        // Assuming your backend has an endpoint like /api/loans/{id}/return
        const response = await fetch(`${API_BASE_URL}/${id}/return`, {
            method: 'PUT', // Often a PUT or POST request to update status
            headers: getHeaders(),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Error: ${response.status}`);
        }

        // Backend might return the updated loan, or just a success message
        return await response.json(); 
    } catch (error) {
        console.error(`Error returning loan ${id}:`, error);
        throw new Error(error.message || 'Failed to return loan');
    }
}

//Jun.7 Based on the backend changes we've made (especially introducing GET /api/loans/own for members 
// and the consistent error response structure for business logic errors), 
// your loans.js file needs a few updates to fully support this.
// - andling Member-Specific Loan Fetching (/api/loans/own)
// - robust Error Handling for createLoan and renewLoan

//Jun.8 upate:
// add renew and return loan functions
// add getMyLoans function to fetch loans for the current user

