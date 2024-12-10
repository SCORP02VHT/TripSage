import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/service/firebaseConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Camera, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { toast } from "sonner";

export const ProfilePage = () => {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [notifications, setNotifications] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const user = auth.currentUser;

  const defaultPfp = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.email;

  useEffect(() => {
    const fetchUserTrips = async () => {
      if (!user?.email) return;

      try {
        const tripsRef = collection(db, "trips");
        const q = query(
          tripsRef, 
          where("userEmail", "==", user.email),
          where("status", "!=", "deleted")
        );
        const querySnapshot = await getDocs(q);
        
        const trips = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          trips.push({
            id: doc.id,
            name: data.location || 'Unnamed Trip',
            date: format(new Date(data.createdAt || Date.now()), 'MMM dd, yyyy'),
            isPublic: data.isPublic || false,
            ...data
          });
        });

        // Sort trips by date (newest first)
        trips.sort((a, b) => new Date(b.date) - new Date(a.date));

        setUserTrips(trips);
        // Add points based on number of trips
        setPoints(trips.length * 100);
      } catch (error) {
        console.error("Error fetching trips:", error);
        toast.error("Error loading trips");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrips();
  }, [user]);

  const handleDeleteTrip = async (tripId) => {
    try {
      await setDoc(doc(db, "trips", tripId), 
        { status: 'deleted' }, 
        { merge: true }
      );
      setUserTrips(trips => trips.filter(t => t.id !== tripId));
      toast.success("Trip deleted successfully");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Error deleting trip");
    }
  };

  const handleTripVisibility = async (tripId, checked) => {
    try {
      await setDoc(doc(db, "trips", tripId), 
        { isPublic: checked }, 
        { merge: true }
      );
      setUserTrips(trips => 
        trips.map(t => 
          t.id === tripId ? {...t, isPublic: checked} : t
        )
      );
      toast.success("Trip visibility updated");
    } catch (error) {
      console.error("Error updating trip visibility:", error);
      toast.error("Error updating trip visibility");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };

  const TripsTabContent = () => (
    <TabsContent value="trips" className="space-y-4">
      {loading ? (
        <Card>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </CardContent>
        </Card>
      ) : userTrips.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No trips created yet</p>
            <Link to="/create-trip">
              <Button>Create Your First Trip</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        userTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex justify-between items-center p-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{trip.name}</h3>
                <p className="text-sm text-gray-500">{trip.date}</p>
                <div className="text-sm text-gray-500 mt-1">
                  <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {trip.userSelection?.noOfDays} days
                  </span>
                  <span className="mx-2">•</span>
                  <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {trip.userSelection?.traveller}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {trip.userSelection?.budget}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Public</span>
                  <Switch 
                    checked={trip.isPublic} 
                    onCheckedChange={(checked) => handleTripVisibility(trip.id, checked)}
                  />
                </div>
                <Link 
                  to={`/view-trip/${trip.id}`}
                  className="transition-colors hover:text-blue-600"
                >
                  <Button size="icon" variant="ghost">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </Link>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => handleDeleteTrip(trip.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </TabsContent>
  );

  const RewardsTabContent = () => (
    <TabsContent value="rewards" className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "10% Off Next Trip", points: 1000, description: "Get 10% off on your next trip booking" },
            { name: "Free Travel Guide", points: 500, description: "Download a premium travel guide for free" },
            { name: "Premium Features", points: 2000, description: "Unlock premium features for 30 days" },
            { name: "Priority Support", points: 1500, description: "Get priority customer support for 3 months" }
          ].map((reward) => (
            <Card key={reward.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-semibold">{reward.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{reward.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {reward.points} points
                </div>
                <Button
                  className="mt-3 w-full"
                  disabled={points < reward.points}
                  onClick={() => toast.info("Reward redemption coming soon!")}
                >
                  {points >= reward.points ? "Redeem" : `Need ${reward.points - points} more points`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={user?.photoURL || defaultPfp}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => toast.info("Profile photo update coming soon!")}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-2xl font-bold">{user?.displayName || "User"}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{points} Points</span>
            </div>
            <div className="w-full pt-4">
              <Link to="/create-trip">
                <Button className="w-full">Create New Trip</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Section */}
        <div className="md:col-span-2">
          <Tabs defaultValue="trips">
            <TabsList className="w-full">
              <TabsTrigger value="trips" className="flex-1">
                My Trips ({userTrips.length})
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1">Rewards</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>

            <TripsTabContent />
            <RewardsTabContent />

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Email Notifications</span>
                      <p className="text-sm text-gray-500">Receive updates about your trips</p>
                    </div>
                    <Switch 
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">Public Profile</span>
                      <p className="text-sm text-gray-500">Allow others to see your public trips</p>
                    </div>
                    <Switch 
                      checked={publicProfile}
                      onCheckedChange={setPublicProfile}
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    variant="destructive" 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};