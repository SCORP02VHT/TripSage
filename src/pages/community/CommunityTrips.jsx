// src/pages/community/CommunityTrips.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquare, Star } from "lucide-react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../service/firebaseConfig";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const TripCard = ({ trip, onLike, onReview }) => {
  return (
    <Card>
      <img
        src={trip.coverImage || "/placeholder-trip.jpg"}
        alt={trip.title}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{trip.title}</h3>
            <p className="text-sm text-gray-600">by {trip.authorName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{trip.averageRating || 0}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{trip.description}</p>
        
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="flex items-center space-x-2"
            onClick={() => onLike(trip.id)}
          >
            <Heart className={`w-4 h-4 ${trip.liked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{trip.likes}</span>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>{trip.reviews?.length || 0} Reviews</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reviews for {trip.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {trip.reviews?.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
                {auth.currentUser && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`w-5 h-5 cursor-pointer ${
                            rating <= (trip.userRating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                          onClick={() => onReview(trip.id, rating)}
                        />
                      ))}
                    </div>
                    <Textarea
                      placeholder="Write your review..."
                      className="w-full"
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <Button className="w-full" onClick={() => onReview(trip.id)}>
                      Submit Review
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export const CommunityTrips = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      const tripsRef = collection(db, "trips");
      const q = query(tripsRef, where("isPublic", "==", true));
      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        liked: doc.data().likedBy?.includes(auth.currentUser?.uid)
      }));
      setTrips(tripsData);
    };

    fetchTrips();
  }, []);

  const handleLike = async (tripId) => {
    if (!auth.currentUser) {
      toast.error("Please sign in to like trips");
      return;
    }

    const tripRef = doc(db, "trips", tripId);
    const trip = trips.find(t => t.id === tripId);
    const userId = auth.currentUser.uid;
    
    const newLikedBy = trip.likedBy || [];
    const userLikedIndex = newLikedBy.indexOf(userId);
    
    if (userLikedIndex === -1) {
      newLikedBy.push(userId);
    } else {
      newLikedBy.splice(userLikedIndex, 1);
    }

    await updateDoc(tripRef, {
      likedBy: newLikedBy,
      likes: newLikedBy.length
    });

    setTrips(trips.map(t => 
      t.id === tripId 
        ? { ...t, liked: !t.liked, likes: newLikedBy.length }
        : t
    ));
  };

  const handleReview = async (tripId, rating, comment) => {
    if (!auth.currentUser) {
      toast.error("Please sign in to review trips");
      return;
    }

    const tripRef = doc(db, "trips", tripId);
    const review = {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName || "Anonymous",
      rating,
      comment,
      createdAt: new Date()
    };

    const trip = trips.find(t => t.id === tripId);
    const reviews = [...(trip.reviews || []), review];
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await updateDoc(tripRef, {
      reviews,
      averageRating
    });

    setTrips(trips.map(t =>
      t.id === tripId
        ? { ...t, reviews, averageRating }
        : t
    ));

    toast.success("Review submitted successfully!");
  };

  const filteredTrips = trips.filter(trip =>
    (trip.title && trip.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (trip.description && trip.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );  

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Trips</h1>
        <div className="w-1/3">
          <Input
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTrips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onLike={handleLike}
            onReview={handleReview}
          />
        ))}
      </div>
    </div>
  );
};