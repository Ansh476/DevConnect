import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    emailId: "",
    password: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    skills: [],
    photourl: "",
    phone: ""
  });
  
  const [isLoginform, setIsLoginform] = useState(true);
  const [error, setError] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'skills' ? value.split(',') : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError("Name is required");
      return false;
    }
    if (formData.firstName.length < 3) {
      setError("First name should be at least 3 characters long");
      return false;
    }
    if (!formData.emailId || !/\S+@\S+\.\S+/.test(formData.emailId)) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      setError("Valid 10-digit phone number is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/login", {
        emailId: formData.emailId,
        password: formData.password
      }, { withCredentials: true });
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  const handleSignup = async () => {
    try {
      if (!validateForm()) return;

      const res = await axios.post(BASE_URL + "/signup", formData, { withCredentials: true });
      if (res.status === 201) {
        setShowOtpDialog(true);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(BASE_URL + "/verify-otp", {
        emailId: formData.emailId,
        otp
      }, { withCredentials: true });

      if (res.status === 200) {
        dispatch(addUser(res.data));
        setShowOtpDialog(false);
        navigate("/");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex justify-center">{isLoginform ? "Login" : "Sign-up"}</h2>
          
          {!isLoginform && (
            <>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg">First Name</span>
                </div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg">Last Name</span>
                </div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg">Age</span>
                </div>
                <input
                  type="number"
                  name="age"
                  placeholder="Enter age"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg">Phone</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10-digit phone number"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg">Photo URL</span>
                </div>
                <input
                  type="url"
                  name="photourl"
                  placeholder="Enter photo URL"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.photourl}
                  onChange={handleInputChange}
                />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg">Gender</span>
                </div>
                <select
                  name="gender"
                  className="select select-bordered w-full max-w-xs"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="others">others</option>
                </select>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text text-lg">Skills</span>
                </div>
                <input
                  type="text"
                  name="skills"
                  placeholder="Enter skills (comma separated)"
                  className="input input-bordered w-full max-w-xs"
                  value={formData.skills.join(",")}
                  onChange={handleInputChange}
                />
              </label>
            </>
          )}

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-lg">Email ID</span>
            </div>
            <input
              type="email"
              name="emailId"
              placeholder="Enter email"
              className="input input-bordered w-full max-w-xs"
              value={formData.emailId}
              onChange={handleInputChange}
            />
          </label>

          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-lg">Password</span>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="input input-bordered w-full max-w-xs"
              value={formData.password}
              onChange={handleInputChange}
            />
          </label>

          {error && <p className="text-red-600">{error}</p>}

          <div className="card-actions justify-center py-4">
            <button
              className="btn btn-primary"
              onClick={isLoginform ? handleLogin : handleSignup}
            >
              {isLoginform ? "Login" : "Signup"}
            </button>
          </div>

          <p
            className="text-xl font-semibold cursor-pointer"
            onClick={() => {
              setIsLoginform(prev => !prev);
              setError("");
            }}
          >
            {isLoginform ? "Don't have an account? Register here" : "Existing user? Sign-in"}
          </p>
          <div className="divider">OR</div>
            <a href="http://localhost:7777/google">
              <button className="btn bg-blue-500 text-white btn-outline btn-accent w-full mb-4">
                Continue with Google
              </button>
            </a>
        </div>
      </div>

      {/* Simple Modal for OTP */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Enter OTP</h3>
            <p className="mb-4">Please enter the OTP sent to your email address</p>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button 
                className="btn btn-ghost"
                onClick={() => setShowOtpDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;