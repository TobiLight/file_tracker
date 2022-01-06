import axios from "axios"

const ApiRequest = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'http://18.195.41.228',
    // baseURL: 'http://localhost:8000',
    // headers: {
    //     'Authorization': `JWT ${token}`
    // }
})

// ApiRequest.interceptors.response.use(response => {
//     return response
// }, error => {
//     if (error?.response.status === 401 || error?.response.status === 403) {
//         localStorage.removeItem('ft_token')
//         localStorage.removeItem('ft_user')
//         localStorage.removeItem('ft_user_has_plan')
//         return error
//     }
//     return error
// })

export default ApiRequest