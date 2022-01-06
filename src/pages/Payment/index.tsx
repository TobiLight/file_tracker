import React, { useEffect, useState } from "react"
import MainLayout from "../../components/layout/MainLayout"
import { Button, Card, DatePicker, Form, Input, message, Select, Skeleton } from "antd"
import { PaymentAPI } from "../../helpers/creditCard"
import useUserStore from "../../store/user"
import { useHistory } from "react-router"
import axios, { AxiosResponse } from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"
import modal from "antd/lib/modal"
import { SubscribeToPlan } from "./Subscribe"
// import { PaymentForm } from "./Container/Payment"
import useLocalStorage from "../../hooks/useLocalStorage"
import { IUser } from "../../lib/interfaces"
import ApiRequest from "../../helpers/axios"
import { useStripe } from "../../hooks/useStripe"

type UserInputType = {
    name?: string
    email?: string
    card_number?: string
    cvc?: string
    exp_year?: string
    exp_month?: string
    line1?: string
    city?: string
    country?: string
}

export const Payment = (): JSX.Element => {
    const [userInput, setUserInput] = useState<UserInputType | undefined | null>({
        name: "",
        email: "",
        card_number: "",
        cvc: "",
        exp_month: "",
        exp_year: "",
        line1: "",
        city: "",
        country: ""
    })
    const [ccType, setCcType] = useState<string | undefined | null>()
    const { checkCreditCard } = PaymentAPI()
    const { getUserHasPlan, getUser } = useUserStore()
    const { checkUserHasStripeAccount, createStripeAccount } = useStripe()
    const history = useHistory()
    const [user,] = useLocalStorage<IUser | undefined>('ft_user', undefined)
    const [userHasPlan,] = useLocalStorage<boolean | undefined>('ft_user_has_plan', undefined)
    const [token,] = useLocalStorage<string | undefined>('ft_token', undefined)
    const [form] = Form.useForm()
    const qc = useQueryClient()


    useEffect(() => {
        qc.invalidateQueries()
        if (!user && !token) {
            return history.replace("/login")
        }

        if ((user && token) && (getUserHasPlan() || userHasPlan)) {
            return history.replace("/user/dashboard/overview")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput({ ...userInput, [event.currentTarget.name]: event.currentTarget.value })
    }


    const handleCreateStripeAccount = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault()
        const user: Partial<UserInputType> = {
            name: form.getFieldValue('first_name') + " " + form.getFieldValue('last_name') || '',
            email: form.getFieldValue('email'),
            card_number: form.getFieldValue('card_number'),
            cvc: form.getFieldValue('cvc'),
            exp_year: userInput?.exp_year,
            exp_month: userInput?.exp_month,
            line1: form.getFieldValue('line1'),
            city: form.getFieldValue('city'),
            country: form.getFieldValue('country')
        }
        form.validateFields().then(values => {
            createStripeAccount.mutate(user)
        }
        ).catch(err => err)

    }

    return (
        <MainLayout>
            <div className="mt-20 sm:w-3/4 md:w-3/4 lg:w-3/5 mx-auto px-5 lg:px-0 min-h-screen">
                {checkUserHasStripeAccount.isLoading &&
                    <div className="grid gap-10 pb-20">
                        <Skeleton.Input active style={{ height: 400, borderRadius: 5 }} />
                    </div>
                }

                {checkUserHasStripeAccount.isError &&
                    <>
                        <div className="mt-8 mb-16">

                            <Card title="Payment Details" className="shadow-md rounded">
                                <Form form={form} layout="vertical">
                                    <div className="flex gap-4 items-center place-items-center">
                                        <Form.Item rules={[{ required: true, message: 'First name is required!' }]} initialValue={user?.first_name || getUser()?.first_name} label="First Name" name="first_name" className="w-full">
                                            <Input disabled={createStripeAccount.isLoading} placeholder="John" className="bg-gray-100 text-gray-400" name="first_name" />
                                        </Form.Item>
                                        <Form.Item rules={[{ required: true, message: 'Last name is required!' }]} initialValue={user?.last_name || getUser()?.last_name} label="Last Name" name="last_name" className="w-full">
                                            <Input disabled={createStripeAccount.isLoading} placeholder="Doe" className="bg-gray-100 text-gray-400" name="last_name" />
                                        </Form.Item>
                                    </div>
                                    <Form.Item rules={[{ required: true, message: 'Email is required!' }]} initialValue={user?.email} label="Email" name="email" className="grid relative">
                                        <Input disabled={createStripeAccount.isLoading} placeholder="info@filetracker.com" type="email" required name="email" className="bg-gray-100 text-gray-600" />
                                    </Form.Item>

                                    <div className="flex gap-4 items-start place-items-start">
                                        <Form.Item rules={[{ required: true, message: 'Card number is required!' }]} label="Card number" name="card_number" className="w-full">
                                            <div className="grid">
                                                <Input disabled={createStripeAccount.isLoading} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(event)
                                                    checkCreditCard(event.currentTarget.value)
                                                    setCcType(checkCreditCard(event.currentTarget.value).type
                                                    )
                                                }} type="text" id="card_number" required name="card_number" className=" text-gray-400 bg-gray-100" placeholder="xxxx xxxx xxxx xxxx" />
                                                {ccType && <p style={{ width: 'fit-content' }} className=" p-1 text-center mt-2 rounded text-gray-100 text-xs font-semibold bg-blue-300">{ccType}</p>}
                                            </div>

                                        </Form.Item>

                                        <Form.Item rules={[{ required: true, message: 'Cvc is required!' }]} label="CVC" name="cvc" className="w-24 h-full">
                                            <Input disabled={createStripeAccount.isLoading} placeholder="xxx" type="text" id="cvc" name="cvc" className=" text-gray-400 bg-gray-100 w-full" />
                                        </Form.Item>
                                    </div>

                                    <Form.Item rules={[{ required: true, message: 'Expiry year and month is required!' }]} label="Expiry" name="expiry">
                                        <DatePicker disabled={createStripeAccount.isLoading} onChange={(date, datestring) => {
                                            setUserInput({ ...userInput, exp_year: datestring.split("-")[0], exp_month: datestring.split("-")[1] })
                                        }} picker="month" placeholder="xxxx-xx" className="bg-gray-100 w-full" />
                                    </Form.Item>


                                    <div className="flex gap-5 items-center place-items-center">
                                        <Form.Item rules={[{ required: true, message: 'Address is required!' }]} label="Address" name="line1" className="w-full">
                                            <Input disabled={createStripeAccount.isLoading} placeholder="Enter your billing address" type="text" id="line1" name="line1" className="bg-gray-100" />
                                        </Form.Item>
                                        <Form.Item rules={[{ required: true, message: 'City is required!' }]} label="City" name="city" className="w-20">
                                            <Input disabled={createStripeAccount.isLoading} placeholder="Enter your city" type="text" id="city" name="city" className="bg-gray-100" />
                                        </Form.Item>
                                    </div>
                                    <Form.Item rules={[{ required: true, message: 'Country is required!' }]} label="Country" name="country" id="country" className="w-full">
                                        <Select disabled={createStripeAccount.isLoading} placeholder="Select country" showSearch={true} optionFilterProp="children"
                                            filterOption={(input: any, option: any) =>
                                                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA: any, optionB: any) =>
                                                optionA?.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                            } style={{ backgroundColor: "rgba(243, 244, 246)" }} className="bg-gray-100 rounded border">
                                            <Select.Option value="AF">Afghanistan</Select.Option>
                                            <Select.Option value="AX">Åland Islands</Select.Option>
                                            <Select.Option value="AL">Albania</Select.Option>
                                            <Select.Option value="DZ">Algeria</Select.Option>
                                            <Select.Option value="AS">American Samoa</Select.Option>
                                            <Select.Option value="AD">Andorra</Select.Option>
                                            <Select.Option value="AO">Angola</Select.Option>
                                            <Select.Option value="AI">Anguilla</Select.Option>
                                            <Select.Option value="AQ">Antarctica</Select.Option>
                                            <Select.Option value="AG">Antigua and Barbuda</Select.Option>
                                            <Select.Option value="AR">Argentina</Select.Option>
                                            <Select.Option value="AM">Armenia</Select.Option>
                                            <Select.Option value="AW">Aruba</Select.Option>
                                            <Select.Option value="AU">Australia</Select.Option>
                                            <Select.Option value="AT">Austria</Select.Option>
                                            <Select.Option value="AZ">Azerbaijan</Select.Option>
                                            <Select.Option value="BS">Bahamas</Select.Option>
                                            <Select.Option value="BH">Bahrain</Select.Option>
                                            <Select.Option value="BD">Bangladesh</Select.Option>
                                            <Select.Option value="BB">Barbados</Select.Option>
                                            <Select.Option value="BY">Belarus</Select.Option>
                                            <Select.Option value="BE">Belgium</Select.Option>
                                            <Select.Option value="BZ">Belize</Select.Option>
                                            <Select.Option value="BJ">Benin</Select.Option>
                                            <Select.Option value="BM">Bermuda</Select.Option>
                                            <Select.Option value="BT">Bhutan</Select.Option>
                                            <Select.Option value="BO">Bolivia, Plurinational State of</Select.Option>
                                            <Select.Option value="BQ">Bonaire, Sint Eustatius and Saba</Select.Option>
                                            <Select.Option value="BA">Bosnia and Herzegovina</Select.Option>
                                            <Select.Option value="BW">Botswana</Select.Option>
                                            <Select.Option value="BV">Bouvet Island</Select.Option>
                                            <Select.Option value="BR">Brazil</Select.Option>
                                            <Select.Option value="IO">British Indian Ocean Territory</Select.Option>
                                            <Select.Option value="BN">Brunei Darussalam</Select.Option>
                                            <Select.Option value="BG">Bulgaria</Select.Option>
                                            <Select.Option value="BF">Burkina Faso</Select.Option>
                                            <Select.Option value="BI">Burundi</Select.Option>
                                            <Select.Option value="KH">Cambodia</Select.Option>
                                            <Select.Option value="CM">Cameroon</Select.Option>
                                            <Select.Option value="CA">Canada</Select.Option>
                                            <Select.Option value="CV">Cape Verde</Select.Option>
                                            <Select.Option value="KY">Cayman Islands</Select.Option>
                                            <Select.Option value="CF">Central African Republic</Select.Option>
                                            <Select.Option value="TD">Chad</Select.Option>
                                            <Select.Option value="CL">Chile</Select.Option>
                                            <Select.Option value="CN">China</Select.Option>
                                            <Select.Option value="CX">Christmas Island</Select.Option>
                                            <Select.Option value="CC">Cocos (Keeling) Islands</Select.Option>
                                            <Select.Option value="CO">Colombia</Select.Option>
                                            <Select.Option value="KM">Comoros</Select.Option>
                                            <Select.Option value="CG">Congo</Select.Option>
                                            <Select.Option value="CD">Congo, the Democratic Republic of the</Select.Option>
                                            <Select.Option value="CK">Cook Islands</Select.Option>
                                            <Select.Option value="CR">Costa Rica</Select.Option>
                                            <Select.Option value="CI">Côte d'Ivoire</Select.Option>
                                            <Select.Option value="HR">Croatia</Select.Option>
                                            <Select.Option value="CU">Cuba</Select.Option>
                                            <Select.Option value="CW">Curaçao</Select.Option>
                                            <Select.Option value="CY">Cyprus</Select.Option>
                                            <Select.Option value="CZ">Czech Republic</Select.Option>
                                            <Select.Option value="DK">Denmark</Select.Option>
                                            <Select.Option value="DJ">Djibouti</Select.Option>
                                            <Select.Option value="DM">Dominica</Select.Option>
                                            <Select.Option value="DO">Dominican Republic</Select.Option>
                                            <Select.Option value="EC">Ecuador</Select.Option>
                                            <Select.Option value="EG">Egypt</Select.Option>
                                            <Select.Option value="SV">El Salvador</Select.Option>
                                            <Select.Option value="GQ">Equatorial Guinea</Select.Option>
                                            <Select.Option value="ER">Eritrea</Select.Option>
                                            <Select.Option value="EE">Estonia</Select.Option>
                                            <Select.Option value="ET">Ethiopia</Select.Option>
                                            <Select.Option value="FK">Falkland Islands (Malvinas)</Select.Option>
                                            <Select.Option value="FO">Faroe Islands</Select.Option>
                                            <Select.Option value="FJ">Fiji</Select.Option>
                                            <Select.Option value="FI">Finland</Select.Option>
                                            <Select.Option value="FR">France</Select.Option>
                                            <Select.Option value="GF">French Guiana</Select.Option>
                                            <Select.Option value="PF">French Polynesia</Select.Option>
                                            <Select.Option value="TF">French Southern Territories</Select.Option>
                                            <Select.Option value="GA">Gabon</Select.Option>
                                            <Select.Option value="GM">Gambia</Select.Option>
                                            <Select.Option value="GE">Georgia</Select.Option>
                                            <Select.Option value="DE">Germany</Select.Option>
                                            <Select.Option value="GH">Ghana</Select.Option>
                                            <Select.Option value="GI">Gibraltar</Select.Option>
                                            <Select.Option value="GR">Greece</Select.Option>
                                            <Select.Option value="GL">Greenland</Select.Option>
                                            <Select.Option value="GD">Grenada</Select.Option>
                                            <Select.Option value="GP">Guadeloupe</Select.Option>
                                            <Select.Option value="GU">Guam</Select.Option>
                                            <Select.Option value="GT">Guatemala</Select.Option>
                                            <Select.Option value="GG">Guernsey</Select.Option>
                                            <Select.Option value="GN">Guinea</Select.Option>
                                            <Select.Option value="GW">Guinea-Bissau</Select.Option>
                                            <Select.Option value="GY">Guyana</Select.Option>
                                            <Select.Option value="HT">Haiti</Select.Option>
                                            <Select.Option value="HM">Heard Island and McDonald Islands</Select.Option>
                                            <Select.Option value="VA">Holy See (Vatican City State)</Select.Option>
                                            <Select.Option value="HN">Honduras</Select.Option>
                                            <Select.Option value="HK">Hong Kong</Select.Option>
                                            <Select.Option value="HU">Hungary</Select.Option>
                                            <Select.Option value="IS">Iceland</Select.Option>
                                            <Select.Option value="IN">India</Select.Option>
                                            <Select.Option value="ID">Indonesia</Select.Option>
                                            <Select.Option value="IR">Iran, Islamic Republic of</Select.Option>
                                            <Select.Option value="IQ">Iraq</Select.Option>
                                            <Select.Option value="IE">Ireland</Select.Option>
                                            <Select.Option value="IM">Isle of Man</Select.Option>
                                            <Select.Option value="IL">Israel</Select.Option>
                                            <Select.Option value="IT">Italy</Select.Option>
                                            <Select.Option value="JM">Jamaica</Select.Option>
                                            <Select.Option value="JP">Japan</Select.Option>
                                            <Select.Option value="JE">Jersey</Select.Option>
                                            <Select.Option value="JO">Jordan</Select.Option>
                                            <Select.Option value="KZ">Kazakhstan</Select.Option>
                                            <Select.Option value="KE">Kenya</Select.Option>
                                            <Select.Option value="KI">Kiribati</Select.Option>
                                            <Select.Option value="KP">Korea, Democratic People's Republic of</Select.Option>
                                            <Select.Option value="KR">Korea, Republic of</Select.Option>
                                            <Select.Option value="KW">Kuwait</Select.Option>
                                            <Select.Option value="KG">Kyrgyzstan</Select.Option>
                                            <Select.Option value="LA">Lao People's Democratic Republic</Select.Option>
                                            <Select.Option value="LV">Latvia</Select.Option>
                                            <Select.Option value="LB">Lebanon</Select.Option>
                                            <Select.Option value="LS">Lesotho</Select.Option>
                                            <Select.Option value="LR">Liberia</Select.Option>
                                            <Select.Option value="LY">Libya</Select.Option>
                                            <Select.Option value="LI">Liechtenstein</Select.Option>
                                            <Select.Option value="LT">Lithuania</Select.Option>
                                            <Select.Option value="LU">Luxembourg</Select.Option>
                                            <Select.Option value="MO">Macao</Select.Option>
                                            <Select.Option value="MK">Macedonia, the former Yugoslav Republic of</Select.Option>
                                            <Select.Option value="MG">Madagascar</Select.Option>
                                            <Select.Option value="MW">Malawi</Select.Option>
                                            <Select.Option value="MY">Malaysia</Select.Option>
                                            <Select.Option value="MV">Maldives</Select.Option>
                                            <Select.Option value="ML">Mali</Select.Option>
                                            <Select.Option value="MT">Malta</Select.Option>
                                            <Select.Option value="MH">Marshall Islands</Select.Option>
                                            <Select.Option value="MQ">Martinique</Select.Option>
                                            <Select.Option value="MR">Mauritania</Select.Option>
                                            <Select.Option value="MU">Mauritius</Select.Option>
                                            <Select.Option value="YT">Mayotte</Select.Option>
                                            <Select.Option value="MX">Mexico</Select.Option>
                                            <Select.Option value="FM">Micronesia, Federated States of</Select.Option>
                                            <Select.Option value="MD">Moldova, Republic of</Select.Option>
                                            <Select.Option value="MC">Monaco</Select.Option>
                                            <Select.Option value="MN">Mongolia</Select.Option>
                                            <Select.Option value="ME">Montenegro</Select.Option>
                                            <Select.Option value="MS">Montserrat</Select.Option>
                                            <Select.Option value="MA">Morocco</Select.Option>
                                            <Select.Option value="MZ">Mozambique</Select.Option>
                                            <Select.Option value="MM">Myanmar</Select.Option>
                                            <Select.Option value="NA">Namibia</Select.Option>
                                            <Select.Option value="NR">Nauru</Select.Option>
                                            <Select.Option value="NP">Nepal</Select.Option>
                                            <Select.Option value="NL">Netherlands</Select.Option>
                                            <Select.Option value="NC">New Caledonia</Select.Option>
                                            <Select.Option value="NZ">New Zealand</Select.Option>
                                            <Select.Option value="NI">Nicaragua</Select.Option>
                                            <Select.Option value="NE">Niger</Select.Option>
                                            <Select.Option value="NG">Nigeria</Select.Option>
                                            <Select.Option value="NU">Niue</Select.Option>
                                            <Select.Option value="NF">Norfolk Island</Select.Option>
                                            <Select.Option value="MP">Northern Mariana Islands</Select.Option>
                                            <Select.Option value="NO">Norway</Select.Option>
                                            <Select.Option value="OM">Oman</Select.Option>
                                            <Select.Option value="PK">Pakistan</Select.Option>
                                            <Select.Option value="PW">Palau</Select.Option>
                                            <Select.Option value="PS">Palestinian Territory, Occupied</Select.Option>
                                            <Select.Option value="PA">Panama</Select.Option>
                                            <Select.Option value="PG">Papua New Guinea</Select.Option>
                                            <Select.Option value="PY">Paraguay</Select.Option>
                                            <Select.Option value="PE">Peru</Select.Option>
                                            <Select.Option value="PH">Philippines</Select.Option>
                                            <Select.Option value="PN">Pitcairn</Select.Option>
                                            <Select.Option value="PL">Poland</Select.Option>
                                            <Select.Option value="PT">Portugal</Select.Option>
                                            <Select.Option value="PR">Puerto Rico</Select.Option>
                                            <Select.Option value="QA">Qatar</Select.Option>
                                            <Select.Option value="RE">Réunion</Select.Option>
                                            <Select.Option value="RO">Romania</Select.Option>
                                            <Select.Option value="RU">Russian Federation</Select.Option>
                                            <Select.Option value="RW">Rwanda</Select.Option>
                                            <Select.Option value="BL">Saint Barthélemy</Select.Option>
                                            <Select.Option value="SH">Saint Helena, Ascension and Tristan da Cunha</Select.Option>
                                            <Select.Option value="KN">Saint Kitts and Nevis</Select.Option>
                                            <Select.Option value="LC">Saint Lucia</Select.Option>
                                            <Select.Option value="MF">Saint Martin (French part)</Select.Option>
                                            <Select.Option value="PM">Saint Pierre and Miquelon</Select.Option>
                                            <Select.Option value="VC">Saint Vincent and the Grenadines</Select.Option>
                                            <Select.Option value="WS">Samoa</Select.Option>
                                            <Select.Option value="SM">San Marino</Select.Option>
                                            <Select.Option value="ST">Sao Tome and Principe</Select.Option>
                                            <Select.Option value="SA">Saudi Arabia</Select.Option>
                                            <Select.Option value="SN">Senegal</Select.Option>
                                            <Select.Option value="RS">Serbia</Select.Option>
                                            <Select.Option value="SC">Seychelles</Select.Option>
                                            <Select.Option value="SL">Sierra Leone</Select.Option>
                                            <Select.Option value="SG">Singapore</Select.Option>
                                            <Select.Option value="SX">Sint Maarten (Dutch part)</Select.Option>
                                            <Select.Option value="SK">Slovakia</Select.Option>
                                            <Select.Option value="SI">Slovenia</Select.Option>
                                            <Select.Option value="SB">Solomon Islands</Select.Option>
                                            <Select.Option value="SO">Somalia</Select.Option>
                                            <Select.Option value="ZA">South Africa</Select.Option>
                                            <Select.Option value="GS">South Georgia and the South Sandwich Islands</Select.Option>
                                            <Select.Option value="SS">South Sudan</Select.Option>
                                            <Select.Option value="ES">Spain</Select.Option>
                                            <Select.Option value="LK">Sri Lanka</Select.Option>
                                            <Select.Option value="SD">Sudan</Select.Option>
                                            <Select.Option value="SR">Suriname</Select.Option>
                                            <Select.Option value="SJ">Svalbard and Jan Mayen</Select.Option>
                                            <Select.Option value="SZ">Swaziland</Select.Option>
                                            <Select.Option value="SE">Sweden</Select.Option>
                                            <Select.Option value="CH">Switzerland</Select.Option>
                                            <Select.Option value="SY">Syrian Arab Republic</Select.Option>
                                            <Select.Option value="TW">Taiwan, Province of China</Select.Option>
                                            <Select.Option value="TJ">Tajikistan</Select.Option>
                                            <Select.Option value="TZ">Tanzania, United Republic of</Select.Option>
                                            <Select.Option value="TH">Thailand</Select.Option>
                                            <Select.Option value="TL">Timor-Leste</Select.Option>
                                            <Select.Option value="TG">Togo</Select.Option>
                                            <Select.Option value="TK">Tokelau</Select.Option>
                                            <Select.Option value="TO">Tonga</Select.Option>
                                            <Select.Option value="TT">Trinidad and Tobago</Select.Option>
                                            <Select.Option value="TN">Tunisia</Select.Option>
                                            <Select.Option value="TR">Turkey</Select.Option>
                                            <Select.Option value="TM">Turkmenistan</Select.Option>
                                            <Select.Option value="TC">Turks and Caicos Islands</Select.Option>
                                            <Select.Option value="TV">Tuvalu</Select.Option>
                                            <Select.Option value="UG">Uganda</Select.Option>
                                            <Select.Option value="UA">Ukraine</Select.Option>
                                            <Select.Option value="AE">United Arab Emirates</Select.Option>
                                            <Select.Option value="GB">United Kingdom</Select.Option>
                                            <Select.Option value="US">United States</Select.Option>
                                            <Select.Option value="UM">United States Minor Outlying Islands</Select.Option>
                                            <Select.Option value="UY">Uruguay</Select.Option>
                                            <Select.Option value="UZ">Uzbekistan</Select.Option>
                                            <Select.Option value="VU">Vanuatu</Select.Option>
                                            <Select.Option value="VE">Venezuela, Bolivarian Republic of</Select.Option>
                                            <Select.Option value="VN">Viet Nam</Select.Option>
                                            <Select.Option value="VG">Virgin Islands, British</Select.Option>
                                            <Select.Option value="VI">Virgin Islands, U.S.</Select.Option>
                                            <Select.Option value="WF">Wallis and Futuna</Select.Option>
                                            <Select.Option value="EH">Western Sahara</Select.Option>
                                            <Select.Option value="YE">Yemen</Select.Option>
                                            <Select.Option value="ZM">Zambia</Select.Option>
                                            <Select.Option value="ZW">Zimbabwe</Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <div className="subtotal border-gray-200 mt-8">
                                        <div className="flex justify-end">
                                            <Form.Item>
                                                <Button htmlType="submit" loading={createStripeAccount.isLoading} disabled={createStripeAccount.isLoading} onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => handleCreateStripeAccount(event)} type="primary">{createStripeAccount.isLoading ? 'Creating account' : 'Create Stripe Account'}</Button>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </Form>
                            </Card>
                        </div>
                    </>
                }

                {checkUserHasStripeAccount.isSuccess &&
                    <SubscribeToPlan />
                }
            </div>
        </MainLayout>
    )
}