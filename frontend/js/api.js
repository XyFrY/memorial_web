// Base URL for all API requests. Change this if the backend is hosted elsewhere.
const API_BASE_URL = "http://localhost:4000/api";

// Check if an API response contains an error and throw a user-friendly error message.
function handleAPIError(error, response, data) {
    if (!response) {
        throw new Error(
            "Unable to connect to the server. Please try again later."
        );
    }

    if (!response.ok) {
        throw new Error(data?.error || "An error occurred. Please try again.");
    }
}

// All authentication-related API calls (login, signup).
const authAPI = {
    // Send login credentials to the server and receive a token if successful.
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Login API error:", error);
            throw error;
        }
    },

    // Create a new user account and return a token for immediate login.
    async signup(name, email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Signup API error:", error);
            throw error;
        }
    },
};

// All memorial-related API calls (get, create, update, delete).
const memorialAPI = {
    // Fetch all memorials from the database. Requires authentication.
    async getAll(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/memorials`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Get memorials API error:", error);
            throw error;
        }
    },

    // Create a new memorial with the provided data. Requires authentication.
    async create(memorialData, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/memorials`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(memorialData),
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Create memorial API error:", error);
            throw error;
        }
    },
};

// Make the API modules available globally so they can be used in any script.
window.authAPI = authAPI;
window.memorialAPI = memorialAPI;
