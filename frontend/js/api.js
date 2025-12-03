const API_BASE_URL = "http://localhost:4000/api";

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

const authAPI = {
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

const memorialAPI = {
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

const authStorage = {
    saveAuth(token, user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
    },

    getToken() {
        return localStorage.getItem("authToken");
    },

    getUser() {
        const userJson = localStorage.getItem("user");
        return userJson ? JSON.parse(userJson) : null;
    },

    clearAuth() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
    },

    isAuthenticated() {
        return !!this.getToken();
    },
};

const uploadAPI = {
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

window.authAPI = authAPI;
window.memorialAPI = memorialAPI;
window.authStorage = authStorage;
window.uploadAPI = uploadAPI;
