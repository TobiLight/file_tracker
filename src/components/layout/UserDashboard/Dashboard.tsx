import '../styles/dashboard.css'
import useWindowSize from "../../../hooks/useWindowSize"
import { MobileLayout } from "./Mobile"
import { Footer } from "./Footer"
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import AddUserIcon from '../../icons/adduser'
import FileIcon from '../../icons/file'
import FolderIcon from '../../icons/folder'
import HomeIcon from '../../icons/home'
import { LogoutIcon } from '../../icons/logout'
import SettingsIcon from '../../icons/settings'
import UsersIcon from '../../icons/users'

type DashboardLayoutType = {
    children: React.ReactNode
    className?: string
}
const DashboardLayout = ({ children, className = '' }: DashboardLayoutType): JSX.Element => {
    const windowSize = useWindowSize()
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const { LogoutHandler } = useAuth()
    const handleCollapse = () => {
        setCollapsed(!collapsed)
    }

    // Mobile layout
    if (windowSize.width < 640) {
        return (
            <MobileLayout>
                {children}
            </MobileLayout>
        )
    }

    // Tablet & Desktop layout
    return (
        <div className={windowSize.width < 640 ? "min-h-screen bg-gray-50 relative" : "min-h-screen bg-gray-50 flex flex-row relative"}>
            <aside className={collapsed ? 'sidebar_closed bg-black h-auto relative flex flex-col justify-between items-center' : "sidebar bg-black sticky flex flex-col justify-between items-center"}>
                <div className="sidebar-wrapper bg-black h-full flex flex-col space-y-14">
                    <ul className="text-gray-300 flex flex-col mt-8">
                        <Link className="py-4" to="/">
                            <li className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    {/* <HomeIcon className="w-5 h-4 self-center" /> */}
                                    {'<'}
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Go back home</p>
                                </div>
                            </li>
                        </Link>

                        <NavLink exact activeClassName="ft-active" className="py-4" to="/user/dashboard/overview">
                            <li className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    <HomeIcon className="w-5 h-4 self-center" />
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Overview</p>
                                </div>
                            </li>
                        </NavLink>

                        <NavLink exact activeClassName="ft-active" className="py-4" to="/user/dashboard/contacts">
                            <li className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    <UsersIcon className="w-5 h-4 self-center" />
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Contacts</p>
                                </div>
                            </li>
                        </NavLink>

                        <NavLink exact activeClassName="ft-active" className="py-4" to="/user/dashboard/files">
                            <li className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    <FileIcon className="w-5 h-4 tooltip self-center" />
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Files</p>
                                </div>
                            </li>
                        </NavLink>

                        <NavLink exact activeClassName="ft-active" className="py-4" to="/user/dashboard/folders">
                            <li className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    <FolderIcon className="w-5 h-4 tooltip self-center" />
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Folders</p>
                                </div>
                            </li>
                        </NavLink>

                        <NavLink exact activeClassName="ft-active" className="py-4" to="/user/dashboard/invite">
                            <li className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    <AddUserIcon className="w-5 h-4 tooltip self-center" />
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Invite</p>
                                </div>
                            </li>
                        </NavLink>

                        <NavLink exact activeClassName="ft-active" className="py-4" to="/user/dashboard/settings">
                            <li className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    <SettingsIcon className="w-5 h-4 tooltip self-center" />
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Settings</p>
                                </div>
                            </li>
                        </NavLink>

                        <div className="py-4">
                            <li onClick={LogoutHandler} className={collapsed ? "flex justify-center px-3 cursor-pointer" : "flex justify-between items-center place-content-center cursor-pointer px-3"}>
                                <div className={collapsed ? "flex" : "flex space-x-2"}>
                                    <LogoutIcon className="w-5 h-4 tooltip self-center" />
                                    <p className={!collapsed ? "nav-text" : "nav-text-hidden"}>Logout</p>
                                </div>
                            </li>
                        </div>
                    </ul>
                </div>
                <div onClick={handleCollapse} className={collapsed ? "sider-trigger-closed bg-gray-800 text-white" : "sider-trigger bg-gray-800 text-white"}>
                    <p>
                        {collapsed ? '>' : '<'}
                    </p>
                </div>
            </aside>
            <div className="flex flex-col flex-1 bg-gray-200">
                <div style={{ margin: '24px 16px 20px' }} className="flex flex-auto flex-col flex-shrink flex-grow h-full">
                    {children}
                </div>
                <Footer />
            </div>
        </div >
    )
}

export default DashboardLayout