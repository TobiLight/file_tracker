import { Layout } from "antd"
import { Content } from "antd/lib/layout/layout"
import React, { useState } from "react"
import { useNetworkDetector } from "../../hooks/useNetworkDetector"
import { IMainPageLayout } from "../../lib/interfaces"
import SiteFooter from "../shared/Footer"
import FileTrackerHeader from "../shared/Header"
import "./styles/mainlayout.css"

const MainLayout = ({ children }: IMainPageLayout): JSX.Element => {
    const { networkStatus } = useNetworkDetector()
    const [closeNetowkrStatusNotification, setCloseNetworkNotification] = useState<boolean>(false)
    const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
        return setCloseNetworkNotification(true)
    }

    return (
        <Layout className="min-h-screen">
            <FileTrackerHeader />
            {!networkStatus && !closeNetowkrStatusNotification &&
                <div className="flex justify-between items-center place-items-center fixed bottom-0 z-30 bg-red-200 w-full p-2">
                    <p className="font-medium text-lg">You are not connected to the internet</p>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded" onClick={handleNotificationClick}>close</button>
                </div>
            }
            <Content className="site-layout" style={{ marginTop: 64 }}>
                {children}
            </Content>
            <SiteFooter />
        </Layout>

    )
}

export default MainLayout