import { NavLink } from "react-router-dom"
import { FormButton } from "../../components/forms/button"
import { FormInput } from "../../components/forms/TextField/input"
import { FormTextArea } from "../../components/forms/TextField/textarea"
import MainLayout from "../../components/layout/MainLayout"
import "./style/index.css"
import "./style/style.css"

type ContactFormCSSType = {
    className: string
}

const ContactForm = ({ className }: ContactFormCSSType): JSX.Element => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { }
    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => { }
    return (
        <div className={className}>
            <form className="my-12 bg-white rounded mx-auto w-10/12 lg:my-0 p-8 shadow-md">
                <div className="flex space-x-5">
                    <div className="firstname mt-5 w-full">
                        <label htmlFor="firstname" className="flex flex-col font-semibold">
                            First Name
                            <FormInput className="contact-input mt-2 w-full" name="firstname" value={undefined} onChange={handleChange} disabled={false} type={"text"} />
                        </label>
                    </div>
                    <div className="lastname mt-5 w-full">
                        <label htmlFor="lastname" className="flex flex-col font-semibold">
                            Last Name
                            <FormInput className="contact-input mt-2 w-full" name="lastname" value={undefined} onChange={handleChange} disabled={false} type={"text"} />
                        </label>
                    </div>
                </div>
                <div className="mt-5 w-full">
                    <label htmlFor="email" className="flex flex-col font-semibold">
                        Email
                        <FormInput className="contact-input mt-2 w-full" name="email" value={undefined} onChange={handleChange} disabled={false} type={"email"} />
                    </label>
                </div>
                <div className="mt-5 w-full">
                    <label htmlFor="message" className="flex flex-col font-semibold">
                        Message
                        <FormTextArea className={"contact-input mt-2 w-full"} value={undefined} handlechange={handleChange} disabled={false} name={"message"} cols={30} rows={5} />
                    </label>
                </div>
                <div className="mt-5 w-full">
                    <label htmlFor="additional-message" className="flex flex-col font-semibold">
                        Additional Message
                        <FormTextArea className={"contact-input mt-2 w-full"} value={undefined} handlechange={handleChange} disabled={false} name={"additional-message"} cols={30} rows={5} />
                    </label>
                </div>
                <div className="mt-6 w-full">
                    <FormButton className="rounded font-bold bg-blue-500 hover:bg-blue-600 p-4 text-white w-full" btnText={"Send message"} onClick={handleSubmit} />
                </div>
            </form>
        </div>
    )
}

const ContactInfo = ({ className }: ContactFormCSSType): JSX.Element => {
    return (
        <div className={className}>
            <div className="flex flex-col w-full mb-10 lg:mb-0 lg:w-10/12">
                <h1 className="font-bold text-xl">How Can We Help?</h1>
                <p className="mt-4">Please select a topic below related to your inquiry. If you don’t find what you need, fill out our contact form.</p>

                <div className="book-demo my-5 border-b-4 border-double">
                    <NavLink to="/demo" className="text-blue-500 font-bold">Book a Demo</NavLink>
                    <p className="mt-3 mb-5">Request a demo from one of our conversion specialists.</p>
                </div>

                <div className="get-inspired my-5 border-b-4 border-double">
                    <NavLink to="/get-inspired" className="text-blue-500 font-bold">Get Inspired</NavLink>
                    <p className="mt-3 mb-5">Discover the many ways in which our customers use File Tracker.</p>
                </div>

                <div className="partner my-5 border-b-4 border-double">
                    <NavLink to="/partnership" className="text-blue-500 font-bold">Become a Partner</NavLink>
                    <p className="mt-3 mb-5">Join our Partner Program and earn 25% recurring commissions.</p>
                </div>
            </div>
        </div>
    )
}

const Contact = (): JSX.Element => {
    return (
        <MainLayout>
            <div className="w-2/3 lg:w-2/5 flex flex-col space-y-3 text-center mx-auto lg:py-24">
                <h1 className="text-2xl font-semibold">Contact File Tracker</h1>
                <p className="tracking-wide">
                    We’re here to help and answer any question you might have. We look forward to hearing from you.
                    🙂
                </p>
            </div>
            <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:space-x-3 lg:mb-20">
                <ContactForm className="flex flex-col space-y-8 lg:w-9/12" />
                <ContactInfo className="w-10/12 mx-auto mb-10 lg:mb-0 lg:w-8/12 lg:pr-5 lg:relative lg:top-44" />
            </div>
        </MainLayout>
    )
}

export default Contact