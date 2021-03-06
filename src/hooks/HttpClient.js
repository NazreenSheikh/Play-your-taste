import axios from 'axios'
import { useState, useCallback } from 'react'

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const sendRequest = useCallback(
        async (fetchURL, fetchParams, fetchHost) => {
            setIsLoading(true)

            const options = {
                method: 'GET',
                url: fetchURL,
                params: fetchParams,
                headers: {
                    'x-rapidapi-key': import.meta.env.VITE_SHAZAM_API_KEY,
                    'x-rapidapi-host': fetchHost,
                },
            }

            try {
                const response = await axios.request(options)
                const responseData = await response.data

                setIsLoading(false)
                return responseData
            } catch (err) {
                setError(err.message)
                setIsLoading(false)
                throw err
            }
        },
        []
    )

    return { isLoading, error, sendRequest }
}
