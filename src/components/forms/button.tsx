import { IFormButton } from "../../lib/interfaces"

export const FormButton = ({ style, className, onClick, btnText, disabled }: IFormButton): JSX.Element => {
    return (
        <button disabled={disabled} style={style} className={className} onClick={onClick}>{btnText}</button>
    )
}