import { Breadcrumb } from "antd"
import { Content } from "antd/lib/layout/layout"
import { StorageIcon } from "../../../../components/icons/storage"
import { AdminLayout } from "../../../../components/layout/AdminDashboard/Admin"

export const ManageStorage = (): JSX.Element => {
    return (
        <AdminLayout>
            <div style={{ margin: '24px 16px 0' }} className="pt-8">
                <Breadcrumb className="flex items-center">
                    <Breadcrumb.Item href="">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <div className="flex items-center space-x-2">
                            <StorageIcon width=".8em" height=".8em" />
                            <p>Storage</p>
                        </div>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Content style={{ margin: '24px 16px 20px' }} className="bg-white rounded">

            </Content>
        </AdminLayout>
    )
}