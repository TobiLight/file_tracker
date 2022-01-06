import { IFormInput } from "../../../lib/interfaces"

/**
 * @param {name, placeholder, value, disabled, onChange, className, type}
 * @returns HTML TEXT INPUT FIELD
 */

export const FormInput = ({ required, name, placeholder, value, disabled, onChange, className, type }: IFormInput): JSX.Element => {
    return (
        <input required={required} type={type} className={className} name={name} id={name} placeholder={placeholder} value={value} disabled={disabled} onChange={onChange} />
    )
}
