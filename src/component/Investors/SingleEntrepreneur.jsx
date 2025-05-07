import React, { useEffect, useState } from "react";
import axios from "axios";
import { notify } from "../../Utiles/Notification";
import Loader from "../../Utiles/Loader";
import { UserState } from "../../context/UserContext";

const SingleEntrepreneur = () => {
  const baseUrl = import.meta.env.VITE_APP_BASEURL;
  const { user } = UserState();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const searchParams = new URLSearchParams(location.search);
  const customer_unique_id = searchParams.get("entrepreneur_id");

  const getSingleEnt = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${baseUrl}/get_single_entrepreneur`,
        { customer_unique_id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.data.status) {
        setCustomerData(response.data.customer_data);
      }
    } catch (error) {
      notify("error", "Failed to fetch customer details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleEnt();
  }, [baseUrl, user?.token]);

  return <div>SingleEntrepreneur</div>;
};

export default SingleEntrepreneur;
