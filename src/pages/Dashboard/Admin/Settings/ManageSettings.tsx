import { Breadcrumb } from "antd"
import { AdminLayout } from "../../../../components/layout/AdminDashboard/Admin"
import SettingOutlined from "@ant-design/icons/lib/icons/SettingOutlined"
import { Content } from "antd/lib/layout/layout"


export const ManageSettings = (): JSX.Element => {
    return (
        <AdminLayout>
            <div style={{ margin: '24px 16px 0' }} className="pt-8">
                <Breadcrumb className="flex items-center">
                    <Breadcrumb.Item href="">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <div className="flex items-center space-x-2">
                            <SettingOutlined width="1em" height="1em" />
                            <p>Settings</p>
                        </div>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Content style={{ margin: '24px 16px 20px' }} className="bg-white rounded">

            </Content>
        </AdminLayout>
    )
}