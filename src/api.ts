import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://0.0.0.0:8000'
})

// No need for dev headers - we use JWT authentication only
export default api
