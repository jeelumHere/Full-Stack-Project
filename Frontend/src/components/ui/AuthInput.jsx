// components/ui/AuthInput.jsx
import { useId, useState } from 'react'

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.6 20.6 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a20.6 20.6 0 0 1-3.22 4.4M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
)

const AuthInput = ({ label, type = 'text', name, value = '', onChange, icon, error, required }) => {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="flex flex-col gap-xs">
      <div className="relative flex items-center">
        {icon && (
          <img
            src={icon}
            alt=""
            className="absolute left-3 w-4 h-4 opacity-50 pointer-events-none"
          />
        )}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          required={required}
          placeholder=" "
          className={`peer w-full border rounded-md bg-surface text-textMain
            pt-5 pb-2 text-base transition-colors duration-150
            ${icon ? 'pl-9' : 'pl-3'} ${isPassword ? 'pr-10' : 'pr-3'}
            ${error ? 'border-error' : 'border-border'}
            focus-visible:border-primary`}
        />

        <label
          htmlFor={id}
          className={`absolute ${icon ? 'left-9' : 'left-3'} top-1/2 -translate-y-1/2
            text-textMuted text-base transition-all duration-150 pointer-events-none
            peer-focus:top-3 peer-focus:text-xs peer-focus:text-primary
            peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs`}
        >
          {label}
        </label>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-3 text-textMuted hover:text-textMain transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
      </div>

      {error && (
        <span className="text-error text-xs flex items-center gap-1">
          {error}
        </span>
      )}
    </div>
  )
}

export default AuthInput