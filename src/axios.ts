import { makeUseAxios } from 'axios-hooks'
import axios from 'axios'

export const useAxios = makeUseAxios({
  cache: false,
  axios: axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    }
  })
})
