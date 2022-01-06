import React from "react"
import { Layout } from "antd"
import { Footer } from "antd/lib/layout/layout"
import Sider from "antd/lib/layout/Sider"
import { NavLink } from "react-router-dom"
import UsersIcon from "../../icons/users"
import SettingOutlined from "@ant-design/icons/lib/icons/SettingOutlined"
import LogoutOutlined from "@ant-design/icons/lib/icons/LogoutOutlined"
import HomeOutlined from "@ant-design/icons/lib/icons/HomeOutlined"
import { PlanIcon } from "../../icons/plan"
import { StorageIcon } from "../../icons/storage"
import { useAuth } from "../../../hooks/useAuth"


type AdminProps = {
    children: React.ReactNode
}
export const AdminLayout = ({ children }: AdminProps): JSX.Element => {
    const { LogoutHandler } = useAuth()

    return (
        <Layout className="min-h-screen flex flex-row">
            <Sider
                className="h-auto"
            // breakpoint="lg"
            // collapsedWidth="0"
            // onBreakpoint={broken => {
            //     console.log(broken);
            // }}
            // onCollapse={(collapsed, type) => {
            //     console.log(collapsed, type);
            // }}
            >
                <div className="logo" />
                <ul className="mt-14 px-4 grid gap-8">
                    <NavLink activeClassName="ft-admin-nav" to="/admin/dashboard/overview">
                        <li className="flex items-center text-gray-300 hover:text-gray-100 transition-all ease-linear">
                            <HomeOutlined width="1em" height="1em" className="mr-3" />
                            <p>Overview</p>
                        </li>
                    </NavLink>

                    <NavLink activeClassName="ft-admin-nav" to="/admin/dashboard/manage-users">
                        <li className="flex items-center text-gray-300 hover:text-gray-100 transition-all ease-linear">
                            <UsersIcon width="1em" height="1em" className="mr-3" />
                            <p>Users</p>
                        </li>
                    </NavLink>

                    <NavLink activeClassName="ft-admin-nav" to="/admin/dashboard/manage-storage">
                        <li className="flex items-center text-gray-300 hover:text-gray-100 transition-all ease-linear">
                            <StorageIcon width="1em" height="1em" className="mr-3" />
                            <p>Storage</p>
                        </li>
                    </NavLink>

                    <NavLink activeClassName="ft-admin-nav" to="/admin/dashboard/manage-plans">
                        <li className="flex items-center text-gray-300 hover:text-gray-100 transition-all ease-linear">
                            <PlanIcon width="1em" height="1em" className="mr-3" />
                            <p>Plan</p>
                        </li>
                    </NavLink>

                    <NavLink activeClassName="ft-admin-nav" to="/admin/dashboard/settings">
                        <li className="flex items-center text-gray-300 hover:text-gray-100 transition-all ease-linear">
                            <SettingOutlined width="1em" height="1em" className="mr-3" />
                            <p>Settings</p>
                        </li>
                    </NavLink>

                    <div onClick={LogoutHandler} className="cursor-pointer flex items-center text-gray-300 hover:text-gray-100 transition-all ease-linear">
                        <LogoutOutlined className="mr-3" />
                        <p>Logout</p>
                    </div>
                </ul>
            </Sider>
            <Layout>
                {children}
                <Footer style={{ textAlign: 'center' }} className="bg-gray-300">©2021 FileTracker</Footer>
            </Layout>
        </Layout>

    )
}