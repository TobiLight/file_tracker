import { IFormDate } from "../../../lib/interfaces"

export const FormDate = ({ name, className, value, min, max }: IFormDate): JSX.Element => {
    return (
        <input type={'date'} className={className} name={name} id={name} value={value} min={min} max={max} />
    )
}