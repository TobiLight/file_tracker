import { Card, Layout } from "antd"
import { Content } from "antd/lib/layout/layout"

type DashboardContentType = {
    children: React.ReactNode
    title: string | undefined
    extra?: React.ReactNode
}
export const DashboardContent = ({ children, title, extra }: DashboardContentType): JSX.Element => {
    return (
        <Layout className="h-full content">
            <Content className="h-full">
                <Card title={title} extra={extra} className="h-full">
                    {children}
                </Card>
            </Content>
        </Layout>
    )
}