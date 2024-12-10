import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { IoIosSend } from "react-icons/io";
import { db } from "@/service/firebaseConfig"; // Firebase Firestore import
import { doc, getDoc } from "firebase/firestore";

export const InfoSection = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [error, setError] = useState(null);

  const GetPlacePhoto = async () => {
    try {
      const locationRef = doc(db, "locations", trip?.userSelection?.location?.id); // Adjust Firestore reference
      const locationDoc = await getDoc(locationRef);
      if (locationDoc.exists()) {
        const locationData = locationDoc.data();
        const imageUrl = locationData?.photos?.[0] || "/placeholder.jpg"; // Fallback if no photo available
        console.log("Image URL fetched from Firestore:", imageUrl);
        setPhotoUrl(imageUrl);
      } else {
        setError("Location data not found.");
      }
    } catch (err) {
      console.error("Error fetching location photo:", err);
      setError("Failed to load location photo.");
    }
  };

  useEffect(() => {
    if (trip) {
      GetPlacePhoto();
    }
  }, [trip]);

  return (
    <div>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <img
          src={photoUrl || "/placeholder.jpg"}
          className="h-[300px] w-full object-cover rounded-xl"
          alt="Location"
        />
      )}
      <div className="flex justify-between items-center">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.location?.label}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
            <h2 className="p-1 px-1 md:px-3 bg-gray-200 rounded-full text-gray-500">
              📅 {trip?.userSelection?.noOfDays} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500">
              🧳 No. Of Traveler: {trip?.userSelection?.traveller}
            </h2>
          </div>
        </div>
        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
};
