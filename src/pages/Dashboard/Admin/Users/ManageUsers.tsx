import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined"
import EyeOutlined from "@ant-design/icons/lib/icons/EyeOutlined"
import { Breadcrumb, Table, Button, message } from "antd"
import { Content } from "antd/lib/layout/layout"
import { useState } from "react"
import { useMutation, useQuery } from "react-query"
import UsersIcon from "../../../../components/icons/users"
import { AdminLayout } from "../../../../components/layout/AdminDashboard/Admin"
import useLocalStorage from "../../../../hooks/useLocalStorage"
import { IUser } from "../../../../lib/interfaces"
import moment from "moment"
import Loading3QuartersOutlined from "@ant-design/icons/lib/icons/Loading3QuartersOutlined"
import ApiRequest from "../../../../helpers/axios"


const ManageUsers = (): JSX.Element => {
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const [admin,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [users, setUsers] = useState<any[] | undefined>()
    const fetchUsers = async (): Promise<any[]> => {
        try {
            const request = await ApiRequest.get('/user/admin/list/profiles/', {
                headers: {
                    'Authorization': `JWT ${token}`
                }
            })
            return request.data
        } catch (err: any) {
            throw new Error(err)
        }
    }

    const { data, isLoading, isSuccess, isError, refetch } = useQuery(['filetracker_users'], fetchUsers, {
        staleTime: 1000 * 3600,
        onSuccess: data => {
            setUsers(data.map(user => {
                return ({
                    key: user?.user?.email,
                    name: `${user?.user?.first_name} ${user?.user?.last_name}`,
                    email: user?.user?.email,
                    last_login: moment(user?.user?.last_login).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    date_joined: moment(user?.user?.date_joined).format('dddd, MMMM Do YYYY, h:mm:ss a'),
                    has_plan: user?.has_plan
                })
            }))
        }
    })




    const deleteUser = async (email: string) => {
        try {
            const user = await ApiRequest(`/user/admin/delete-profile/${email}/`, {
                headers: {
                    'Authorization': `JWT ${token}`
                },
                method: 'DELETE'
            })
            return user.data
        } catch (err: any) {
            throw new Error(err)
        }
    }

    const deleteUserMutation = useMutation((email: string) => deleteUser(email), {
        onMutate: (data) => {
            message.info('Deleting user...')
        },
        onSuccess: data => {
            console.log(data)
            refetch()
            message.success('User deleted successfully!')
        },
        onError: (err: any) => {
            console.log(err);
            message.error('Cannot perform operation!')
        }
    })

    const handleDelete = (event: React.MouseEvent<HTMLElement, MouseEvent>, email: string) => {
        deleteUserMutation.mutate(email)
    }

    return (
        <AdminLayout>
            <div style={{ margin: '24px 16px 0' }} className="pt-8">
                <Breadcrumb className="flex items-center">
                    <Breadcrumb.Item href="">Dashboard</Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <div className="flex items-center space-x-2">
                            <UsersIcon width=".8em" height=".8em" />
                            <p>Users</p>
                        </div>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Content style={{ margin: '24px 16px 20px' }} className="bg-white rounded">
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Table columns={[
                        { title: 'Email', dataIndex: 'email', width: 300 },
                        // { title: 'Email', dataIndex: 'email', key: 'email', width: 300 },
                        {
                            title: 'Action',
                            dataIndex: '',
                            key: 'x',
                            render: (text, record) => {
                                return (
                                    <div className="flex gap-3 flex-wrap">
                                        {/* <Button className="flex items-center place-content-center" type="default" icon={<EyeOutlined />}></Button> */}
                                        <Button key={record.email} onClick={(event) => handleDelete(event, record.email)} className="flex items-center place-content-center" type="primary" danger icon={<DeleteOutlined />}></Button>
                                    </div>
                                )
                            },
                        },
                    ]}
                        expandable={{
                            expandedRowRender: record => {
                                return (<>
                                    <p style={{ margin: 0 }} className="font-bold">Date Joined: <span className="font-normal">{record.date_joined}</span> </p>
                                    <p style={{ margin: 0 }} className="font-bold">Last Login: <span className="font-normal">{record.last_login}</span></p>
                                    <p style={{ margin: 0 }} className="font-bold">Has Plan: <span className="font-normal">{record.has_plan ? 'Yes' : 'No'}</span></p>
                                </>)
                            },
                            rowExpandable: record => record.name !== 'Not Expandable',
                        }}

                        dataSource={users}

                        pagination={{ total: data?.length, defaultPageSize: 7, }}
                    >

                    </Table>
                </div>
            </Content >

        </AdminLayout >
    )
}

export default ManageUsers