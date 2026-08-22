import axios from "axios"
import api from "./axios"

export async function signup(formData) {
    try {
        const res = await axios.post("/api/auth/register", formData)
        return { success: true, ...res.data }
    }
    catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || "Signup failed" 
        };
    }
}
export async function login(formData) {
    try {
        const res = await axios.post("/api/auth/login", formData)
        return { success: true, ...res.data }
    }
    catch (error) {
        console.log(error.response);
        return { 
          success: false, 
          message: error.response?.data?.message || "Login failed" 
        };
    }
}
export async function verifyEmail(formData) {
    try {
        const res = await axios.post("/api/auth/verifyEmail", formData)
        return { success: true, ...res.data }
    }
    catch (error) {
        console.log(error.response);
        return { 
          success: false, 
          message: error.response?.data?.message || "Email not verified" 
        };
    }
}

export async function getOtp(formData) {
    try {
        const res = await axios.post("/api/auth/getOtp", formData)
        return { success: true, ...res.data }
    }
    catch (error) {
        console.log(error.response);
        return { 
          success: false, 
          message: error.response?.data?.message || "Not a verified email" 
        };
    }
}

export async function refreshToken() {
    try {
        const res = await axios.post("/api/auth/refreshToken")
        return { success: true, ...res.data }
    }
    catch (error) {
        console.log(error.response);
        return { 
          success: false, 
          message: error.response?.data?.message || "Not a valid request" 
        };
    }
}

export async function getMe() {
    try {
        const res = await axios.get("/api/auth/getMe")
        return { success: true, ...res.data }
    }
    catch (error) {
        console.log(error.response);
        return { 
          success: false, 
          message: error.response?.data?.message || "Not a valid request" 
        };
    }
}

export async function setNewPassword(formData) {
    try {
        const res = await axios.post("/api/auth/setNewPassword", formData)
        return { success: true, ...res.data }
    }
    catch (error) {
        console.log(error.response);
        return { 
          success: false, 
          message: error.response?.data?.message || "Server Error" 
        };
    }
}