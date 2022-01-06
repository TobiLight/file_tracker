import { Button, Drawer, Input } from "antd"
import { Header } from "antd/lib/layout/layout"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { IUser } from "../../lib/interfaces"
import { Logo } from "./Nav/Logo"
import { NavMenu } from "./Nav/Nav"
import { NavItem } from "./Nav/NavItem"
import { NavItems } from "./Nav/NavItems"
import useUserStore from "../../store/user"
import BxMenuAltRightIcon from "../icons/menu"
import useLocalStorage from "../../hooks/useLocalStorage"
import "./style.css"

type MobileHeaderType = {
    className?: string
}


const MobileHeader = ({ className }: MobileHeaderType): JSX.Element => {
    const [visible, setVisible] = useState(false);
    const { getUser } = useUserStore()
    const [userInLocalStorage] = useLocalStorage<IUser | undefined | null>('ft_user', undefined)
    const { LogoutHandler } = useAuth()
    const history = useHistory()

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    }

    return (
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }} className={`header border-t-2 border-blue-500 ${className}`}>
            <div
                className="w-full flex justify-between items-center place-items-center">
                <Logo />
                <BxMenuAltRightIcon onClick={showDrawer} className="w-8 h-8 cursor-pointer" />
            </div>
            <Drawer title={<Logo />} visible={visible} onClose={onClose}>
                <NavMenu>
                    <div className="grid gap-8">
                        <Input.Search placeholder="Search..." className="w-full lg:w-auto" enterButton />
                        <NavItems className="grid gap-5">
                            <NavItem to={"/"} text={"Home"} />
                            <NavItem to={"/what-is-file-tracker"} text={"What Is File Tracker"} />
                            <NavItem to={"/products"} text={"Products"} />
                            <NavItem to={"/contact"} text={"Contact"} />
                            {!(getUser()?.email || userInLocalStorage?.email) &&
                                <>
                                    <NavItem to={"/login"} text={"Login"} />
                                    <NavItem to={"/register"} text={"Register"} />
                                </>
                            }
                            {(getUser()?.email || userInLocalStorage?.email) &&
                                <div className="cursor-pointer" onClick={(event) => {
                                    LogoutHandler(event)
                                    onClose()
                                }}>Logout</div>
                            }

                            {(getUser()?.email || userInLocalStorage?.email) &&
                                <NavItem to={"/user/dashboard/overview"} text={"Dashboard"} />
                            }
                            <Button type="primary" onClick={() => history.replace("/register")}>Trial</Button>
                        </NavItems>
                    </div>
                </NavMenu>
            </Drawer>
        </Header>
    )
}

const FileTrackerHeader = (): JSX.Element => {
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const history = useHistory()

    return (
        <>
            {!token && <MobileHeader className="lg:hidden" />}
            {token && <MobileHeader />}
            {!token && <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }} className="hidden lg:block bg-white border-t-2 border-blue-500 py-3 h-auto">
                <div className="flex justify-between items-center">
                    <div className="logo-wrapper">
                        <Logo />
                    </div>
                    <div className="flex justify-end w-full">
                        <div className="flex flex-col place-items-end w-full">
                            <Input.Search placeholder="Search..." className="w-full lg:w-72" enterButton />
                            <NavMenu>
                                <NavItems className="flex space-x-7 justify-end items-center place-items-center py-4">
                                    <NavItem to={"/"} text={"Home"} />
                                    <NavItem to={"/what-is-file-tracker"} text={"What Is File Tracker"} />
                                    <NavItem to={"/products"} text={"Products"} />
                                    <NavItem to={"/contact"} text={"Contact"} />
                                    <Button type="primary" onClick={() => history.replace("/register")}>Trial</Button>
                                </NavItems>
                            </NavMenu>
                        </div>
                    </div>
                </div>
            </Header>}
        </>
    )
}

export default FileTrackerHeader