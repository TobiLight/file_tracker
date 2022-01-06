import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../../../hooks/useAuth"
import AddUserIcon from "../../icons/adduser"
import FileIcon from "../../icons/file"
import FolderIcon from "../../icons/folder"
import HomeIcon from "../../icons/home"
import { LogoutIcon } from "../../icons/logout"
import SettingsIcon from "../../icons/settings"
import UsersIcon from "../../icons/users"
import { Footer } from "./Footer"

type MobileLayoutType = {
    children: React.ReactNode
}

export const MobileLayout = ({ children }: MobileLayoutType): JSX.Element => {
    const { LogoutHandler } = useAuth()
    return (
        <div className="min-h-screen">
            <div className="grid">
                <div className="flex flex-row w-full min-h-screen h-full">
                    <div className="bg-gray-800 w-auto">
                        <nav style={{ height: '100%' }}>
                            <ul style={{ height: '100%' }} className="w-20 flex flex-col space-y-2 text-blue-200 bg-black opactiy-10 pt-14">
                                <Link to="/" className="w-full py-3 flex justify-center">
                                    <li>
                                        /
                                    </li>
                                </Link>
                                <NavLink exact to="/user/dashboard/overview" activeClassName="mobile-nav-link" className="w-full py-3 flex justify-center">
                                    <li>
                                        <HomeIcon className="w-6 h-6" />
                                    </li>
                                </NavLink>
                                <NavLink exact to="/user/dashboard/contacts" activeClassName="mobile-nav-link" className="w-full py-3 flex justify-center">
                                    <li>
                                        <UsersIcon className="w-6 h-6" />
                                    </li>
                                </NavLink>
                                <NavLink exact to="/user/dashboard/files" activeClassName="mobile-nav-link" className="w-full py-3 flex justify-center">
                                    <li>
                                        <FileIcon className="w-6 h-6" />
                                    </li>
                                </NavLink>
                                <NavLink exact to="/user/dashboard/folders" activeClassName="mobile-nav-link" className="w-full py-3 flex justify-center">
                                    <li>
                                        <FolderIcon className="w-6 h-6" />
                                    </li>
                                </NavLink>
                                <NavLink exact to="/user/dashboard/invite" activeClassName="mobile-nav-link" className="w-full py-3 flex justify-center">
                                    <li>
                                        <AddUserIcon className="w-6 h-6" />
                                    </li>
                                </NavLink>
                                <NavLink exact to="/user/dashboard/settings" activeClassName="mobile-nav-link" className="w-full py-3 flex justify-center">
                                    <li>
                                        <SettingsIcon className="w-6 h-6" />
                                    </li>
                                </NavLink>
                                <div className="w-full py-3 flex justify-center cursor-pointer">
                                    <li onClick={LogoutHandler}>
                                        <LogoutIcon className="w-6 h-6" />
                                    </li>
                                </div>
                            </ul>
                        </nav>
                    </div>
                    <div className="grid w-full bg-gray-200">
                        <div className="main w-full p-4 h-full">
                            {children}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}