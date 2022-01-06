import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled"
import { Button } from "antd"
import { DashboardContent } from "../../../../components/layout/UserDashboard/Content"
import DashboardLayout from "../../../../components/layout/UserDashboard/Dashboard"
import "./contact.css"


const users = [
    {
        id: 1,
        userID: 'fireboy',
        show: false
    },
    {
        id: 2,
        userID: 'burnaboy',
        show: false
    },
    {
        id: 3,
        userID: 'omah lay',
        show: false
    },
    {
        id: 4,
        userID: 'bujutoyourears',
        show: false
    },
    {
        id: 5,
        userID: 'oxlade',
        show: false
    }
]


const Contacts = (): JSX.Element => {
    const colors = ['#FAA6FF', '#7353BA', '#0F1020', '#B2FFD6', '#AA78A6', '#606C38', '#FEFAE0', '#FFCAB1', '#E05263']


    const generateRandomColors = (colors: string[]) => {
        let randomNumber = Math.floor((Math.random() * 10) + 1);
        return colors[randomNumber]
    }

    return (
        <DashboardLayout>
            <DashboardContent title="Contacts">
                {/* <h1 className="text-2xl font-bold mb-10">Contacts</h1> */}
                <div className="grid w-full gap-y-4">
                    <div className="flex flex-col space-y-8">
                        {users.map(user => {
                            return (
                                <div key={user.id} className="contact-wrapper rounded-md shadow-md transition-all grid items-center">
                                    <div className="flex justify-between w-full items-center h-full" >
                                        <div className="flex space-x-2 place-items-center p-3">
                                            <div style={{ backgroundColor: generateRandomColors(colors) }} className="transition rounded-full  shadow w-8 h-8 flex place-content-center place-items-center text-white">
                                                <p>{user.userID[0]}</p>
                                            </div>
                                            <p className="text-sm">{user.userID}</p>
                                        </div>
                                        {/* <div className="more">
                                            <div onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => displayContactOptions(user)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer">
                                                <HorizontalMoreIcon className={!user.show ? "w-4 h-4 transition-all delay-75" : "w-4 h-4 transform rotate-90 transition-all delay-75"} />
                                            </div>
                                        </div> */}
                                        <Button className="actions w-12 h-full flex place-items-center place-content-center rounded-tl-none rounded-bl-none" type="primary" danger >
                                            {/* <Button type="primary" danger>delete</Button> */}
                                            <DeleteFilled />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="more-btn flex justify-end space-x-4">
                        <Button
                            type="primary"
                            disabled={true}
                        >prev</Button>
                        <Button type="primary">next</Button>
                    </div>
                </div>
            </DashboardContent >
        </DashboardLayout >
    )
}

export default Contacts