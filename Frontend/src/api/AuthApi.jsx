import axios from "axios"
import api from "./axios"

export async function Signup(formData) {
    try {
        const res = await api.post("/auth/register", formData)
        return res.data.message
    }
    catch (error) {
        console.log(error.response);
        return error.response?.data?.message || "Signup failed";
    }
}