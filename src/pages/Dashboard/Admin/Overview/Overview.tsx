import HomeOutlined from "@ant-design/icons/lib/icons/HomeOutlined"
import { Breadcrumb } from "antd"
import { Content } from "antd/lib/layout/layout"
import { AdminLayout } from "../../../../components/layout/AdminDashboard/Admin"
import "./index.css"

export const AdminOverview = (): JSX.Element => {
    return (
        <AdminLayout>
            <div style={{ margin: '24px 16px 0' }} className="pt-8">
                <Breadcrumb className="flex items-center">
                    <Breadcrumb.Item href="">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <div className="flex items-center space-x-2">
                            <HomeOutlined />
                            <p>Overview</p>
                        </div>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Content style={{ margin: '24px 16px 20px' }} className="bg-white rounded p-4">
                <div className="grid grid-cols-4 gap-4 w-full h-auto">
                    <div className="rounded shadow-md overview-tabs1 text-gray-200 h-32 flex place-content-center place-items-center font-bold">
                        <p>Lorem Ipsum</p>
                    </div>
                    <div className="rounded shadow-md overview-tabs2 text-gray-200 h-32 flex place-content-center place-items-center font-bold">
                        <p>Lorem Ipsum</p>
                    </div>
                    <div className="rounded shadow-md overview-tabs3 text-gray-200 h-32 flex place-content-center place-items-center font-bold">
                        <p>Lorem Ipsum</p>
                    </div>
                    <div className="rounded shadow-md overview-tabs3 text-gray-200 h-32 flex place-content-center place-items-center font-bold">
                        <p>Lorem Ipsum</p>
                    </div>
                </div>
                <div className="grid">

                </div>
            </Content>
        </AdminLayout>
    )
}