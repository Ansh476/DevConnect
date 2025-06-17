import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addConnection } from '../utils/connectionSlice';
import { Link } from 'react-router-dom';

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return <div>Loading...</div>;

  if (connections.length === 0) return <h1>No Connections Found!!!</h1>;

  return (
    <div className='text-center my-10'>
      <h1 className='text-4xl font-bold text-white'>Connections</h1>
      {connections.map((conn, index) => {
        const { _id, firstName, lastName, photourl, age, gender } = conn;

        const name = `${firstName || ''} ${lastName || ''}`.trim();
        const ageGender = age && gender ? `${age}, ${gender}` : '';

        return (
          <div key={index} className='flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto'>
            <div><img className="w-20 h-20 rounded-full" src={photourl} alt="photo" /></div>
            <div className='text-left mx-4'>
              <div className='text-2xl font-bold'>{name}</div>
              {ageGender && <p className='text-xl'>{ageGender}</p>}
            </div>
            <Link to={"/chat/" + _id}><button className="btn bg-blue-400 text-lg"> Chat </button></Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
