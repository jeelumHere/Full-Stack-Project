import React, { useState } from 'react'
import AuthForm from '../../components/ui/AuthForm'
import * as api from "../../api/AuthApi"
import { useNavigate } from 'react-router-dom'


const GetOtpFields = [
  { label: "Username or Email", type: "email", name: "usernameOrEmail", placeholder: "Username or Email", icon: "https://www.svgrepo.com/show/511917/email-1572.svg" },
]

const GetOtp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  const [head, setHead] = useState('OTP Verification')
  const [para, setPara] = useState('Otp will be send to your registered email')
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
      const response = await api.getOtp(formData);
      setRes(response.message);

      
      setTimeout(() => {
        console.log(response.User.isEmailVerified);
      }, 1000);
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
        <div className="w-full md:w-[75%] md:h-[75%]">
          <AuthForm
            para={para}
            head={head}
            fields={GetOtpFields}
            values={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="Send Otp"
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

export default GetOtp