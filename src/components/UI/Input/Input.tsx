import { FC, useState } from 'react'
import styles from './Input.module.scss'
import EyeClose from 'public/assets/svg/icons/eye-close.svg'
import EyeOpen from 'public/assets/svg/icons/eye-open.svg'

interface IProps {
  id?: string
  placeholder?: string
  placeholderBackground?: string
  type: string
  name: string
  addClass?: string
  value?: string
  readOnly?: boolean
  validateError?: string
  onBlur?: (e: any) => void
  onChange?: (e: any) => void
}

const Input: FC<IProps> = ({
  placeholder,
  placeholderBackground = '#191919',
  type,
  name,
  value,
  readOnly,
  addClass,
  validateError,
  onChange,
  onBlur,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const wrapperClasses = [
    styles['wrapper'],
    readOnly ? styles['wrapper--readonly'] : null,
    validateError && styles['wrapper--error'],
    addClass ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const inputclasses = [
    styles['input'],
    type === 'password' ? styles['input--password'] : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div className={wrapperClasses}>
        <input
          className={inputclasses}
          placeholder={placeholder}
          name={name}
          value={value ?? ''}
          type={showPassword ? 'text' : type}
          onChange={onChange}
          onBlur={onBlur}
          id={name}
          readOnly={readOnly}
        />
        {placeholder && (
          <label
            className={styles['label-placeholder']}
            htmlFor={`${name}`}
            style={{ backgroundColor: placeholderBackground }}
          >
            {placeholder}
          </label>
        )}
        {type === 'password' && (
          <button
            type="button"
            className={styles['show-password']}
            onClick={() => setShowPassword(!showPassword)}
            disabled={readOnly}
          >
            {showPassword ? (
              <EyeOpen className={styles['eye']} />
            ) : (
              <EyeClose className={styles['eye']} />
            )}
          </button>
        )}
      </div>

      {validateError && (
        <div className={'input-message input-message--error'}>{validateError}</div>
      )}
    </>
  )
}

export default Input
