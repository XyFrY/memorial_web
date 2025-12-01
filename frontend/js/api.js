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
    // Fetch all memorials from the database. Token is optional.
    async getAll(token = null, includeUnapproved = false) {
        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const url = includeUnapproved
                ? `${API_BASE_URL}/memorials?includeUnapproved=true`
                : `${API_BASE_URL}/memorials`;

            const response = await fetch(url, {
                method: "GET",
                headers: headers,
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Get memorials API error:", error);
            throw error;
        }
    },

    // Fetch memorials created by the logged-in user. Requires authentication.
    async getSelf(token) {
        try {
            const response = await fetch(`${API_BASE_URL}/memorials/self`, {
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
            console.error("Get user memorials API error:", error);
            throw error;
        }
    },

    // Fetch a single memorial by ID. Token is optional.
    async getById(memorialId, token = null) {
        try {
            const headers = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/memorials/${memorialId}`, {
                method: "GET",
                headers: headers,
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Get memorial by ID API error:", error);
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

    // Delete a memorial (user deletes their own). Requires authentication.
    async deleteSelf(memorialId, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/memorials/${memorialId}/self`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Delete memorial API error:", error);
            throw error;
        }
    },

    // Approve or reject a memorial (admin only). Requires admin authentication.
    async updateApproval(memorialId, approved, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/memorials/${memorialId}/approval`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ approved }),
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Update approval API error:", error);
            throw error;
        }
    },

    // Delete any memorial (admin only). Requires admin authentication.
    async deleteAdmin(memorialId, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/memorials/${memorialId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Delete memorial API error:", error);
            throw error;
        }
    },
};

// Helper functions for managing authentication state in the browser.
const authStorage = {
    // Save the user's token and info to localStorage so they stay logged in across page reloads.
    saveAuth(token, user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
    },

    // Get the saved authentication token from localStorage, or null if not logged in.
    getToken() {
        return localStorage.getItem("authToken");
    },

    // Get the saved user info from localStorage, or null if not logged in.
    getUser() {
        const userJson = localStorage.getItem("user");
        return userJson ? JSON.parse(userJson) : null;
    },

    // Remove all authentication data from localStorage to log the user out.
    clearAuth() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
    },

    // Check if the user is currently logged in by seeing if we have a token saved.
    isAuthenticated() {
        return !!this.getToken();
    },
};

// Image upload API
const uploadAPI = {
    // Upload an image file and return the image URL
    async uploadImage(imageFile, token) {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);

            const response = await fetch(`${API_BASE_URL}/upload/image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            handleAPIError(null, response, data);

            return data;
        } catch (error) {
            console.error("Image upload API error:", error);
            throw error;
        }
    },
};

// Make the API modules available globally so they can be used in any script.
window.authAPI = authAPI;
window.memorialAPI = memorialAPI;
window.authStorage = authStorage;
window.uploadAPI = uploadAPI;
