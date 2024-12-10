import React, { useState, useEffect } from "react";  
import { Button } from "@/components/ui/button";  
import { Link, useNavigate, useLocation } from "react-router-dom";  
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";  
import { Home, Globe2, PlusCircle, User, MapPin, Bookmark, Settings, LogOut } from "lucide-react";  
import { auth, onAuthStateChanged, signOut } from "@/service/firebaseConfig";  
import { toast } from "sonner";  
import AuthDialog from "./AuthDialog";  // Import the new AuthDialog component  

export const Navbar = () => {  
  const navigate = useNavigate();  
  const location = useLocation();  
  const [user, setUser] = useState(null);  
  const [imageError, setImageError] = useState(false);  

  useEffect(() => {  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {  
      setUser(currentUser);  
      setImageError(false);  
    });  

    return () => unsubscribe();  
  }, []);  

  const getProfileImage = (user) => {  
    if (!imageError && user?.photoURL) {  
      return user.photoURL;  
    }  
    return "/default-avatar.jpg";  
  };  

  const handleLogout = async () => {  
    try {  
      await signOut(auth);  
      toast.success("Logged out successfully");  
      navigate("/");  
    } catch (error) {  
      console.error(error);  
      toast.error("Failed to log out");  
    }  
  };  

  const navLinks = [  
    { path: "/", label: "Home", icon: Home },  
    { path: "/community", label: "Community", icon: Globe2 },  
  ];  

  const userMenuLinks = [  
    { path: "/profile", label: "Profile", icon: User },  
    { path: "/my-trips", label: "My Trips", icon: MapPin },  
    { path: "/saved-trips", label: "Saved Trips", icon: Bookmark },  
    { path: "/settings", label: "Settings", icon: Settings },  
  ];  

  const isActivePath = (path) => location.pathname === path;  

  return (  
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">  
      <div className="container flex h-16 items-center justify-between">  
        <div className="flex items-center gap-6">  
          <Link to="/">  
            <img src="/TripSage.png" alt="TripSage Logo" className="h-8 w-auto" />  
          </Link>  
          <div className="hidden md:flex items-center gap-1">  
            {navLinks.map(({ path, label, icon: Icon }) => (  
              <Link key={path} to={path}>  
                <Button variant={isActivePath(path) ? "default" : "ghost"} className="flex items-center gap-2">  
                  <Icon className="h-4 w-4" />  
                  {label}  
                </Button>  
              </Link>  
            ))}  
          </div>  
        </div>  

        <div className="flex items-center gap-4">  
          {user ? (  
            <>  
              <Link to="/create-trip">  
                <Button className="hidden md:flex items-center gap-2">  
                  <PlusCircle className="h-4 w-4" />  
                  Create Trip  
                </Button>  
              </Link>  
              <Popover>  
                <PopoverTrigger asChild>  
                  {/* Updated to Button for consistency */}  
                  <Button variant="ghost" className="flex items-center gap-2">  
                    <User className="h-4 w-4" />  
                    Profile  
                  </Button>  
                </PopoverTrigger>  
                <PopoverContent className="w-56 mt-5" align="center">  
                  <div className="space-y-1">  
                    <div className="flex items-center gap-2 border-b pb-2">  
                      <img  
                        src={getProfileImage(user)}  
                        alt="Profile"  
                        className="h-8 w-8 rounded-full object-cover"  
                      />  
                      <div className="flex-1 overflow-hidden">  
                        <p className="text-sm font-medium truncate">{user.displayName || user.email}</p>  
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>  
                      </div>  
                    </div>  
                    {userMenuLinks.map(({ path, label, icon: Icon }) => (  
                      <Link key={path} to={path}>  
                        <Button variant={isActivePath(path) ? "default" : "ghost"} className="w-full justify-start gap-2 text-sm">  
                          <Icon className="h-4 w-4" />  
                          {label}  
                        </Button>  
                      </Link>  
                    ))}  
                    <Button variant="ghost" className="w-full justify-start gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>  
                      <LogOut className="h-4 w-4" />  
                      Log Out  
                    </Button>  
                  </div>  
                </PopoverContent>  
              </Popover>  
            </>  
          ) : (  
            <AuthDialog />  
          )}  
        </div>  
      </div>  
    </nav>  
  );  
};