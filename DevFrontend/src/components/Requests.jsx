import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addRequest, removerequest } from '../utils/requestSlice'

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector((store)=>store.request)

    const reviewrequest = async (status,_id) => {
        try{
            const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + _id,{},{withCredentials:true})
            dispatch(removerequest(_id));
        }catch(err){
            console.error(err)
        }
    }

    const fetchrequests = async() =>{
        try{
        const res = await axios.get(BASE_URL+ "/user/requests/received",{withCredentials:true})
        // const requser = res?.data?.data?.map((req)=>req.fromuserId);  this is extracting the user directly , we wanted requets id as well so we did it using other method
        // console.log(requser);
        // dispatch(addRequest(requser));
        // console.log(res?.data?.data);
        dispatch(addRequest(res?.data?.data));
        }catch(err){
            console.error(err)
        }
    }
    useEffect(()=>{
        fetchrequests()
    },[]);

  if(!requests) return;

  if(requests.length==0) return <h1 className='text-center text-2xl font-bold '>No Requests Found!!!</h1>;
  
  return (
    <div className="text-center my-10">
        <h1 className="text-4xl font-bold">Requests</h1>
        {requests.map((request) => {
            const { _id, firstName, lastName, gender, age, skills ,photourl} = request.fromuserId;
            return (
                <div key={_id} className="flex justify-between items-center w-1/2 m-4 p-4 rounded-lg bg-base-300 mx-auto">
                    <img src={photourl} alt="photo" />
                    <div className="text-left mx-4">
                        <h2 className="font-bold">{`${firstName} ${lastName}`}</h2>
                        <p>{`${age}, ${gender}`}</p>
                        <p>Skills: {skills.join(", ")}</p>
                    </div>
                    <div>
                        <button className="btn btn-primary mx-2" onClick={()=>reviewrequest("rejected",request._id)}>Reject</button>
                        <button className="btn btn-secondary mx-2" onClick={()=>reviewrequest("accepted",request._id)}>Accept</button>
                    </div>
                </div>
            );
        })}
    </div>
);
};

export default Requests;