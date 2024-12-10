// src/components/view-trip/HotelCard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhotoUrl } from '@/utils/photoHelpers';
import { convertToINR } from '@/utils/currency';

export const HotelCard = ({ item }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhoto = async () => {
      if (item?.placeId) {
        const url = await getPhotoUrl(item.placeId);
        setPhotoUrl(url);
      }
      setLoading(false);
    };
    loadPhoto();
  }, [item]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-[250px] rounded-xl"></div>;
  }

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${item?.HotelName} ${item?.HotelAddress}`
      )}`}
      target="_blank"
      className="block"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img
          src={photoUrl || '/placeholder.jpg'}
          className="rounded-xl h-[180px] w-full object-cover"
          alt={item?.HotelName}
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{item?.HotelName}</h2>
          <h2 className="text-xs text-gray-500">📍 {item?.HotelAddress}</h2>
          <h2 className="text-sm">💰 {convertToINR(item?.Price || '$0')}</h2>
          <h2 className="text-sm">⭐ {item?.Rating}</h2>
        </div>
      </div>
    </Link>
  );
};