import React, { useEffect } from 'react';
import Editprofile from './Editprofile';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { addUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constants';

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, { 
          withCredentials: true 
        });
        if (res?.data) {
          dispatch(addUser(res.data));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    if (!user || !user.firstName) {
      fetchUserData();
    }
  }, [dispatch, user]);

  if (!user || !user.firstName) {
    return (
      <div className="flex justify-center items-center my-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading profile data...</span>
      </div>
    );
  }

  return (
    <div>
      <Editprofile user={user} />
    </div>
  );
};

export default Profile;