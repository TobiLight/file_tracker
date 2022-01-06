/**
 * File Tracker User Dashboard using Antd Design.
 */

import { Layout, Menu, Breadcrumb } from 'antd';
import {
    FileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { FC, useState } from 'react';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export const UserDashboard: FC = (): JSX.Element => {
    const [collapsed, setCollapsed] = useState<boolean | undefined>(false)
    // Toggle sidebar
    const handleCollapse = () => {
        setCollapsed(!collapsed)
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={handleCollapse}>
                <div className="h-8 m-4 bg-gray-700"></div>
                <Menu theme="dark" mode="inline" forceSubMenuRender={true}>
                    <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                        <Menu.Item key="1">Tom</Menu.Item>
                        <Menu.Item key="2">Bill</Menu.Item>
                        <Menu.Item key="3">Alex</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="4" icon={<FileOutlined />}>
                        Files
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="bg-gray-200">
                <Header className="bg-white h-auto" style={{ padding: 0 }}>
                    <div className="p-4 flex justify-end">
                        <div className="rounded-full bg-gray-100 w-16 h-16 shadow-inner flex items-center place-content-center cursor-pointer">
                            <UserOutlined className="text-xl" />
                        </div>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="bg-white rounded shadow-lg" style={{ padding: 24 }}>
                        <div className="h-full flex flex-col">
                            <p>Bill is a cat</p>
                        </div>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>File Tracker ©2021</Footer>
            </Layout>
        </Layout>
    )
}