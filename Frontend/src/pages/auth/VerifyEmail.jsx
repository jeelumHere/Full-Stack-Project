import React, { useState } from 'react'
import AuthForm from '../../components/ui/AuthForm'
import * as api from "../../api/AuthApi"
import { useNavigate } from 'react-router-dom'


const verifyEmailFields = [
  { label: "Email", type: "email", name: "email", placeholder: "Email", icon: "https://www.svgrepo.com/show/511917/email-1572.svg" },
  { label: "OTP", type: "text", name: "otp", placeholder: "OTP", icon: "https://img.icons8.com/?size=100&id=poVlgAcqxww6&format=png" }
]

const verifyEmail = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', otp: '' })
  const [errors, setErrors] = useState({})
  const [head, setHead] = useState('Verfy Your Email')
  const [para, setPara] = useState('Enter otp sent to your registered email')
  const [res, setRes] = useState('')
  const [div, setDiv] = useState("Didn't receive otp?")
  const [link, setLink] = useState('Resend Otp')
  const [linkNavigate, setLinkNavigate] = useState('/getOtp')
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.verifyEmail(formData);
      setRes(response.message);

      setTimeout(() => navigate("/"), 1000);
      
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
            fields={verifyEmailFields}
            values={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Verify Email"
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

export default verifyEmail