import React, { useEffect } from 'react'
import axios from 'axios';
import { BASE_URL } from '../utils/constants'
import { useDispatch,useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';


const Feed = () => {
  const feed = useSelector((store) =>store.feed);
  console.log(feed)
  const dispatch = useDispatch();

  const getfeed = async() =>{
    try{
    if(feed) return;
    const res = await axios.get(BASE_URL + "/user/feed",{withCredentials:true});
    dispatch(addFeed(res.data));
    }
    catch(err) {
      console.error(err);
    }
  }

  useEffect(()=>{
    getfeed()
  },[]);

  // if(!feed) return;

  // if(feed.length <=0) return <h1 className='text-center text-2xl font-semibold'>No users found</h1>
  return (
    <div className='bg-gradient-to-r from-primary via-secondary to-tertiary'>
      <div className="flex flex-wrap justify-center gap-6 my-10 ">
        {feed?.data?.length > 0 ? (
          <UserCard user={feed.data[0]}/>
        ) : (
          <h1 className='text-center text-2xl font-semibold'>No users found</h1>
        )}
      </div>
    </div>
  );
}

export default Feed