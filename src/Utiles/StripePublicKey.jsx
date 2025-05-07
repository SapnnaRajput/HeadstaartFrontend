import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserState } from "../context/UserContext";

const useStripeCredentials = () => {
    const baseUrl = import.meta.env.VITE_APP_BASEURL;
    const [publicKey, setPublicKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = UserState();

    useEffect(() => {
        const fetchCredentials = async () => {
            setError(null);
            setLoading(true);
            try {
                if (!user?.token) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${baseUrl}/get_stripe_credentials`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                
                if (response.data.status) {
                    setPublicKey(response.data.public_key);
                }
            } catch (error) {
                const errorMessage = 'Unauthorized access please login again';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchCredentials();
    }, [user?.token, baseUrl]);

    return {
        publicKey,
        error,
        loading
    };
};

export default useStripeCredentials;