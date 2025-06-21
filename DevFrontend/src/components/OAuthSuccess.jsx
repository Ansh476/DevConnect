// src/pages/OAuthSuccess.jsx
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const OAuthSuccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // set token as cookie (not needed if already set by backend)
    document.cookie = `token=${token}; path=/;`;

    // fetch user info
    axios
      .get(BASE_URL+"/user/me", { withCredentials: true })
      .then((res) => {
        dispatch(addUser(res.data));
        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  return <p>Logging in with Google...</p>;
};

export default OAuthSuccess;
