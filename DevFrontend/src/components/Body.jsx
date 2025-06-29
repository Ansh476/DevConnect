import React, { useEffect } from 'react'
import Navbar from './Navbar'
import axios from 'axios';
import { Outlet, useNavigate,Link } from 'react-router-dom'
import Footer from './Footer'
import { BASE_URL } from '../utils/constants'
import { useDispatch ,useSelector} from 'react-redux'
import { addUser } from '../utils/userSlice'


const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store)=>store.user);
  const fetchUser = async() =>{
    if(userData) return;
    try{
      const res = await axios.get(BASE_URL + "/profile/view",{withCredentials:true});
      dispatch(addUser(res.data));
    }
    catch(err){
      if(err.status===401){
        navigate("/login")
      }
      console.error(err)}
  }
  useEffect(()=>{
    fetchUser()
  },[]);
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary via-secondary to-tertiary">
      <Navbar />
        <Outlet />
      <Footer />
    </div>
  )
}

export default Body