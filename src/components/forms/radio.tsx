import { IFormRadio } from "../../lib/interfaces"

export const FormRadio = ({ name, className, value }: IFormRadio): JSX.Element => {
    return (
        <input type={'radio'} className={className} name={name} id={name} value={value} />
    )
}