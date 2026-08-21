import React, { useState } from 'react'
import AuthForm from '../../components/ui/AuthForm'
import * as api from "../../api/AuthApi"
import { useNavigate } from 'react-router-dom'


const loginFields = [
  { label: "New Password", type: "password", name: "newPassword", autoComplete: "new-password", placeholder: "New Password", icon: "https://www.svgrepo.com/show/381142/password-protection-privacy-access-verification-code.svg" },
  { label: "Confirm Password", type: "password", name: "confirmPassword", autoComplete: "new-password", placeholder: "Confirm Password", icon: "https://www.svgrepo.com/show/381142/password-protection-privacy-access-verification-code.svg" }
]

const ReSetPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' })
  const [errors, setErrors] = useState({})
  const [head, setHead] = useState('Set New Password')
  const [para, setPara] = useState('Make sure you remember it')
  const [res, setRes] = useState('')
  const [div, setDiv] = useState("")
  const [link, setLink] = useState('')
  const [linkNavigate, setLinkNavigate] = useState('')
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.setNewPassword(formData);
      setRes(response.message);

      if (response.success) {
        setTimeout(() => navigate("/"), 1000);
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
        <div className="w-full md:w-[75%] md:h-[75%]">
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
            div={div}
            link={link}
            linkNavigate={linkNavigate}
          />
        </div>
      </div>

    </>
  )
}

export default ReSetPassword