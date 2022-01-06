import { IFormCheckBox } from "../../lib/interfaces"

export const Chekcbox = ({ name, className, checked, handleCheckboxChange }: IFormCheckBox): JSX.Element => {
    return (
        <input onChange={handleCheckboxChange} type={'checkbox'} className={className} name={name} id={name} checked={checked} />
    )
}