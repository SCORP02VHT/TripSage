// src/pages/view-trip/ViewTrip.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { InfoSection } from '@/components/view-trip/InfoSection';
import { HotelSection } from '@/components/view-trip/HotelSection';
import { VisitSection } from '@/components/view-trip/VisitSection';
import { Loading } from '@/components/common/Loading';
import { toast } from 'sonner';

export const ViewTrip = () => {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTripData = async () => {
      try {
        const docRef = doc(db, 'trips', tripId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setTripData(docSnap.data());
        } else {
          setError('Trip not found');
          toast('No Trip Found');
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip data');
        toast('Error loading trip');
      } finally {
        setLoading(false);
      }
    };

    getTripData();
  }, [tripId]);

  if (loading) {
    return (
      <div>
        <div className="flex justify-center items-center min-h-screen">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="p-10 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-10 md:px-20 lg:px-44 xl:px-56">
        <InfoSection trip={tripData} />
        <HotelSection trip={tripData} />
        <VisitSection trip={tripData} />
      </div>
      <Footer />
    </div>
  );
};