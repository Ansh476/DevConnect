import React from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removefeed } from '../utils/feedSlice';
import { BASE_URL } from '../utils/constants'

const UserCard = ({ user,showActions = true}) => {
  
  const dispatch = useDispatch();

  const handlesendreq = async (status,_id) =>{
    try{
      const res = await axios.post(BASE_URL+ '/request/send/'+status+"/"+_id, {}, {withCredentials:true})
      dispatch(removefeed(_id));
    }catch(error){
      console.error(error)
    }
  }

  // console.log(user);
  const { _id,firstName, lastName, age, photourl, gender, skills } = user;

  return (
    <div className="card card-compact bg-base-100 w-96 shadow-xl overflow-hidden bg-gray-100">
      {/* Remove gaps between the image and card */}
      <figure className="m-0">
        <img
          src={photourl} // {photourl}
          alt="https://t3.ftcdn.net/jpg/06/59/57/56/360_F_659575640_mKCJlXJiCHGxi4v76N4QvDhTUcOCXOAN.jpg"
          className="w-full h-64 object-fill "
        />
      </figure>
      <div className="card-body">
        (<h2 className="card-title">{firstName + ' ' + lastName}</h2>)
        {age && gender && (
          <p className="text-lg">{'Age: ' + age + ', ' + 'Gender: ' + gender}</p>
        )}
        {skills && (
          <p className="text-lg">{'Skills: ' + skills.join(', ')}</p>
        )}
        {showActions && (<div className="card-actions flex justify-center my-4">
          <button className="btn bg-pink-700 text-lg" onClick={()=>handlesendreq("ignored",_id)}>Ignore</button>
          <button className="btn bg-blue-700 text-lg" onClick={()=>handlesendreq("interested",_id)}>Interested</button>
        </div>)}
      </div>
    </div>
  );
};

export default UserCard;
