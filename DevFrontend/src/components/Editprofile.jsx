import React ,{useState,useEffect}from 'react'
import UserCard from './UserCard';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import axios from 'axios';

const Editprofile = ({user}) => {
    const [firstName, setfirstname] = useState(user?.firstName || '');
    const [lastName, setlastname] = useState(user?.lastName || '');
    const [age, setage] = useState(user?.age || '');
    const [gender, setgender] = useState(user?.gender || '');
    const [skills, setskills] = useState(user?.skills || '');
    const [photourl, setphotourl] = useState(user?.photourl || '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setfirstname(user.firstName || '');
            setlastname(user.lastName || '');
            setage(user.age || '');
            setgender(user.gender || '');
            setskills(user.skills || '');
            setphotourl(user.photourl || '');
        }
    }, [user]);

    const dispatch = useDispatch();

const saveprofile = async () => {
  setError("");
  try {
    const res = await axios.post(BASE_URL + "/profile/edit", {
      firstName,
      lastName,
      age,
      gender,
      skills,
      photourl
    }, { withCredentials: true });

    const updatedUser = res?.data?.data;
    const msg = res?.data?.message;

    if (updatedUser) {
      dispatch(addUser(updatedUser)); // updates Redux store
      alert(msg || "Profile updated successfully.");
    } else {
      alert("Profile update failed. Please try again.");
    }

  } catch (err) {
    console.error("Frontend Error >>>", err.response?.data || err.message);
    setError(err.response?.data?.error || "Something went wrong.");
    alert(err.response?.data?.error || "Something went wrong.");
  }
}

return (
    <div className='flex flex-col lg:flex-row justify-center items-center my-10'>
        <div className='flex justify-center my-10 mx-10'>
            <div className="card bg-base-300 w-80 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title flex justify-center">Edit profile</h2>
                    <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-lg">FirstName:</span>
                    </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                    value={firstName}
                    onChange={(e) => setfirstname(e.target.value)} />
                    </label>
                    <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-lg">LastName:</span>
                    </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                    value={lastName}
                    onChange={(e)=>setlastname(e.target.value)}/>
                    </label>
                    <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-lg">Age:</span>
                    </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                    value={age}
                    onChange={(e)=>setage(e.target.value)}/>
                    </label>
                    <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-lg">Gender:</span>
                    </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                    value={gender}
                    onChange={(e)=>setgender(e.target.value)}/>
                    </label>
                    <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-lg">Skills:</span>
                    </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                    value={skills}
                    onChange={(e)=>setskills(e.target.value)}/>
                    </label>
                    <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text text-lg">Photourl:</span>
                    </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" 
                    value={photourl}
                    onChange={(e)=>setphotourl(e.target.value)}/>
                    </label>
                    <p className='text-red-600'>{error}</p>
                    <div className="card-actions justify-center py-4">
                    <button className="btn btn-primary" onClick={saveprofile}>Save Profile</button>
                    </div>
                </div>
            </div>
        </div>
        <UserCard user={{firstName,lastName,age,gender,skills,photourl}}showActions={false}/>
    </div>

)
}


export default Editprofile