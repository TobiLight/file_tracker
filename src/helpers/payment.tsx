import axios from "axios"

type CheckStripeType = {
    token: string | undefined
    email: string | undefined
}
export const checkUserHasStripe = async ({ token, email }: CheckStripeType): Promise<any> => {
    try {
        const data = await axios.get(`http://localhost:8000/plan/stripe/customer/${email}`, {
            headers: {
                'Authorization': `JWT ${token}`
            }
        })
        return data.data
    } catch (err: any) {
        throw new Error(err)
    }
}