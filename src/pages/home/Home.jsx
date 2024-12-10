// src/pages/home/Home.jsx
import React, { useEffect, useState } from "react";
import { Hero } from "../../components/dashboard/Hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Users } from "lucide-react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../service/firebaseConfig";
import { Link } from "react-router-dom";

const TrendingTrips = ({ trips }) => {
  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Trending Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <img
                src={trip.coverImage || "/placeholder-trip.jpg"}
                alt={trip.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{trip.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{trip.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{trip.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>{trip.likes}</span>
                  </div>
                </div>
                <Link to={`/view-trip/${trip.id}`}>
                  <Button className="w-full mt-4">View Trip</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const RecommendedDestinations = ({ destinations }) => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Recommended Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Card key={dest.id}>
              <img
                src={dest.image || "/placeholder-destination.jpg"}
                alt={dest.name}
                className="w-full h-40 object-cover"
              />
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{dest.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{dest.description}</p>
                <Link to={`/create-trip?destination=${dest.name}`}>
                  <Button variant="outline" className="w-full">
                    Plan Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Home = () => {
  const [trendingTrips, setTrendingTrips] = useState([]);
  const [recommendedDestinations, setRecommendedDestinations] = useState([]);

  useEffect(() => {
    const fetchTrendingTrips = async () => {
      const tripsRef = collection(db, "trips");
      const q = query(tripsRef, orderBy("likes", "desc"), limit(6));
      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrendingTrips(trips);
    };

    const fetchRecommendedDestinations = async () => {
      // This could be replaced with an AI recommendation system
      const destinations = [
        {
          id: 1,
          name: "Bali, Indonesia",
          description: "Tropical paradise with beautiful beaches and rich culture",
          image: "/destinations/bali.jpg"
        },
        {
          id: 2,
          name: "Tokyo, Japan",
          description: "Modern city with traditional charm and amazing food",
          image: "/destinations/tokyo.jpg"
        },
        // Add more destinations
      ];
      setRecommendedDestinations(destinations);
    };

    fetchTrendingTrips();
    fetchRecommendedDestinations();
  }, []);

  return (
    <div>
      <Hero />
      <TrendingTrips trips={trendingTrips} />
      <RecommendedDestinations destinations={recommendedDestinations} />
    </div>
  );
};