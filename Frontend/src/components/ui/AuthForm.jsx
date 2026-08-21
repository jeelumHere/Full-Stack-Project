// components/ui/AuthForm.jsx
import AuthInput from './AuthInput'
import { Link } from 'react-router-dom'

// AuthForm.jsx
const AuthForm = ({ head, para, fields, values, errors, onChange, onSubmit, submitLabel, res, loading,div,link,linkNavigate }) => {
    return (
        <div className="flex w-full h-full rounded-lg overflow-hidden shadow-lg bg-surface">

            <div className="w-full md:w-1/2 flex items-center justify-center p-section">
                <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-sm">

                    <div className="text-center">
                        <h2>{head}</h2>
                        <p className="text-textMuted text-sm ">{para}</p>
                    </div>

                    {fields.map((field) => (
                        <AuthInput
                            key={field.name}
                            {...field}
                            value={values[field.name]}
                            error={errors[field.name]}
                            onChange={onChange}
                            required
                        />
                    ))}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 cursor-pointer w-full py-3 rounded-md bg-primary text-white font-semibold
    text-base transition-transform duration-150 hover:opacity-90 active:scale-[0.98]"
                    >
                        {loading ? (
                            <span className="flex justify-center items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Processing...
                            </span>
                        ) : (
                            submitLabel
                        )}
                    </button>
                    <div className='flex'>
                        <div>{div}</div><Link to={linkNavigate} className='text-blue-700 hover:underline'>{link}</Link>
                    </div>
                    <div className='text-success mb-2'>{res}</div>
                </form>
            </div>
            <div className="hidden md:block w-1/2 h-full  bg-[#F6F4FA]">
                <img
                    className="w-full h-full object-contain"
                    src="https://ik.imagekit.io/enfirzscim/Auth.png"
                    alt=""
                />

            </div>

        </div>
    )
}

export default AuthForm