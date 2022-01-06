import { Button, Form, Input, message, Space } from "antd";
import { DashboardContent } from "../../../../components/layout/UserDashboard/Content"
import DashboardLayout from "../../../../components/layout/UserDashboard/Dashboard"

export const Invite = (): JSX.Element => {
    const [form] = Form.useForm();

    const onFinish = () => {
        message.success('Submit success!');
    };

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };

    const onFill = () => {
        form.setFieldsValue({
            email: 'helloworld@filetracker.com'
        });
    };
    return (
        <DashboardLayout>
            <DashboardContent title="Invite">
                {/* <h1 className="text-2xl font-bold mb-10">Invite</h1> */}
                <div className="grid mt-10">
                    <h3 className="mb-5">Send invite to people you want to share your file(s) with</h3>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <div style={{ overflow: 'hidden' }}>
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input an E-mail!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                                <Button htmlType="button" onClick={onFill}>
                                    Fill
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </DashboardContent>
        </DashboardLayout>
    )
}