import { NavLink } from "react-router-dom"

type NavItemType = {
    to: string
    text: string
}
export const NavItem = ({ to, text }: NavItemType) => (
    <li className="whitespace-nowrap">
        <NavLink exact className={(isActive) => isActive ? 'isActive' : 'hover:text-blue-500'} to={to}>
            {text}
        </NavLink>
    </li>
)