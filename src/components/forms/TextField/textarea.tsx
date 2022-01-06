import { IFormTextArea } from "../../../lib/interfaces"

export const FormTextArea = ({ name, cols, rows, placeholder, value, disabled, handlechange, className }: IFormTextArea): JSX.Element => {
    return (
        <textarea className={className} name={name} id={name} cols={cols} rows={rows} value={value} disabled={disabled} onChange={handlechange} placeholder={placeholder} />
    )
}