import { NavLink } from "react-router-dom"

export const Logo = (): JSX.Element => {
    return (
        <NavLink to="/">
            <p className="tracking-widest text-md font-bold">F<span className="text-gray-500">i</span>l<span className="text-gray-500">e</span> T<span className="text-gray-500">r</span>a<span className="text-gray-500">c</span>k<span className="text-gray-500">e</span>r</p>
        </NavLink>
    )
}