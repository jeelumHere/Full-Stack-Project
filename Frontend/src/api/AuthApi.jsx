import axios from "axios"
import api from "./axios"

export async function Signup(formData) {
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
export async function Login(formData) {
    try {
        const res = await axios.post("/api/auth/register", formData)
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