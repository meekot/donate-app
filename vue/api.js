import axios from 'axios'
import { ElNotification } from 'element-plus'
const axiosInstance = axios.create({
  baseURL: 'http' + process.env.API_HOST
})
export const createDonate = async (amount, currency) => {
  try {
    return (await axiosInstance.post('donate', {donate: {amount, currency}})).data.donate
  } catch (error) {
    const errorMsg = error.response?.data?.error
    ElNotification({
      title: 'Error',
      message: errorMsg? Array.isArray(errorMsg)? errorMsg.join('\n'): errorMsg : error.message || 'Request failed',
      type: 'error'
    })

    throw error

  }
}