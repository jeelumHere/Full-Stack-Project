import React, { useState } from 'react'
import AuthForm from '../../components/ui/AuthForm'
import * as api from "../../api/AuthApi"
import { useNavigate } from 'react-router-dom'


const loginFields = [
  { label: "Username Or Email", type: "text", name: "usernameOrEmail", placeholder: "Username or Email", icon: "https://www.svgrepo.com/show/491507/user.svg" },
  { label: "Password", type: "password", name: "password", autoComplete: "new-password", placeholder: "Password", icon: "https://www.svgrepo.com/show/381142/password-protection-privacy-access-verification-code.svg" }
]

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' })
  const [errors, setErrors] = useState({})
  const [head, setHead] = useState('Login to your account')
  const [para, setPara] = useState('Login to get started')
  const [res, setRes] = useState('')
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.Login(formData);
      setRes(response.message);

      console.log(response.User.isEmailVerified);
      if (response.success) {
        if (response.User.isEmailVerified) {
          setTimeout(() => navigate("/"), 1000);
        } else {
          setTimeout(() => navigate("/verifyOtp"), 1000);
        }
      }
    }
    catch (err) {
      console.error("Login failed:", err);
      setRes(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center p-4">
        <div className="w-full md:w-[75%] h-[75%]">
          <AuthForm
            para={para}
            head={head}
            fields={loginFields}
            values={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Login"
            res={res}
            loading={loading}
          />
        </div>
      </div>

    </>
  )
}

export default Login