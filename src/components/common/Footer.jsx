import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year

  return (
    <footer
      // style={{
      //   position: "absolute",
      //   bottom: 0,
      //   left: 0,
      //   width: "100%",
      // }}
      className="bg-white rounded-lg shadow"
    >
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentYear}{" "}
          <Link to={"/"} className="hover:underline">
            TripSage™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
