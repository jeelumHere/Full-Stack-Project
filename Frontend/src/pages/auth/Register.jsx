// Register.jsx
import React, { useState } from 'react'
import AuthForm from '../../components/ui/AuthForm'

const registerFields = [
    { label: "E-mail", type: "email", name: "email", placeholder: "example@gmail.com", icon: "https://www.svgrepo.com/show/511917/email-1572.svg" },
    { label: "Username", type: "text", name: "username", placeholder: "Username", icon: "https://www.svgrepo.com/show/491507/user.svg" },
    { label: "Password", type: "password", name: "password", placeholder: "Password", icon: "https://www.svgrepo.com/show/381142/password-protection-privacy-access-verification-code.svg" },
    { label: "Confirm Password", type: "password", name: "confirmPassword", placeholder: "Confirm Password", icon: "https://www.svgrepo.com/show/535485/lock-closed.svg" }
]

const Register = () => {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' })
    const [errors, setErrors] = useState({})
    const [head, setHead] = useState('Create your account')
    const [para, setPara] = useState('Sign up to get started')
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // validation + submit logic goes here
    }

    return (
        <>
            <div className="h-screen flex justify-center items-center p-4">
                <div className="w-full md:w-[75%] h-[75%]">
                    <AuthForm
                        para={para}
                        head={head}
                        fields={registerFields}
                        values={formData}
                        errors={errors}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        submitLabel="Create account"
                    />
                </div>
            </div>

        </>
    )
}

export default Register