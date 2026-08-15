// components/ui/AuthForm.jsx
import AuthInput from './AuthInput'

// AuthForm.jsx
const AuthForm = ({ head, para, fields, values, errors, onChange, onSubmit, submitLabel }) => {
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
                        className="mt-2 w-full py-3 rounded-md bg-primary text-white font-semibold
          text-base transition-transform duration-150 hover:opacity-90 active:scale-[0.98]"
                    >
                        {submitLabel}
                    </button>
                </form>
            </div>
{/* bg-[#F8F7F9] */}
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