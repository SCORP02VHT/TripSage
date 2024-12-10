// src/pages/my-trips/MyTrips.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { Navbar } from '@/components/common/Navbar';
import { MyTripCard } from '@/components/user-trip/MyTripCard';
import { Loading } from '@/components/common/Loading';

export const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserTrips = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        // if (!user?.email) {
        //   navigate('/');
        //   return;
        // }

        const tripsRef = collection(db, 'trips');
        const q = query(tripsRef, where('userEmail', '==', user.email));
        const querySnapshot = await getDocs(q);
        
        const trips = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUserTrips(trips);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError('Failed to fetch trips. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getUserTrips();
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
        <h2 className="font-bold text-2xl">My Trips</h2>
        {error ? (
          <div className="text-red-500 mt-4">{error}</div>
        ) : userTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {userTrips.map((item) => (
              <MyTripCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10 text-gray-500">
            No trips available. Create your first trip!
          </div>
        )}
      </div>
    </div>
  );
};