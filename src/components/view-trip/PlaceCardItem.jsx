// src/components/view-trip/PlaceCardItem.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPhotoUrl } from '@/utils/photoHelpers';

export const PlaceCardItem = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhoto = async () => {
      if (place?.placeId) {
        const url = await getPhotoUrl(place.placeId);
        setPhotoUrl(url);
      }
      setLoading(false);
    };
    loadPhoto();
  }, [place]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-[130px] rounded-xl"></div>;
  }

  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        place?.PlaceName
      )}`}
      target="_blank"
      className="block"
    >
      <div className="border p-3 rounded-xl flex gap-5 hover:scale-105 transition-all hover:shadow-sm cursor-pointer">
        <img
          src={photoUrl || '/placeholder.jpg'}
          className="w-[100px] h-[130px] rounded-xl object-cover"
          alt={place?.PlaceName}
        />
        <div>
          <h2 className="font-bold text-lg">{place.PlaceName}</h2>
          <p className="text-sm text-gray-600">{place.PlaceDetails}</p>
          <h2 className="mt-2">🕗 {place.TimeTravel}</h2>
        </div>
      </div>
    </Link>
  );
};