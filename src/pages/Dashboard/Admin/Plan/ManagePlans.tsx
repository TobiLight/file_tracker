import { Breadcrumb, Button, Card } from "antd"
import { Content } from "antd/lib/layout/layout"
import { PlanIcon } from "../../../../components/icons/plan"
import { AdminLayout } from "../../../../components/layout/AdminDashboard/Admin"

export const ManagePlans = (): JSX.Element => {
    const AddButtonPlan = (): JSX.Element => {
        return (
            <Button type="primary">Add Plan</Button>
        )
    }
    return (
        <AdminLayout>
            <div style={{ margin: '24px 16px 0' }} className="pt-8">
                <Breadcrumb className="flex items-center">
                    <Breadcrumb.Item href="">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <div className="flex items-center space-x-2">
                            <PlanIcon width=".8em" height=".8em" />
                            <p>Plan</p>
                        </div>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Content style={{ margin: '24px 16px 20px' }}>
                <Card title="Plans" extra={<AddButtonPlan />} className="h-full">

                </Card>
            </Content>

        </AdminLayout>
    )
}