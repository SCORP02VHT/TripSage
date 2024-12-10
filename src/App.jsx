import { useState } from "react";
import "./App.css";
import { Hero } from "./components/dashboard/Hero";
import { Navbar } from "./components/common/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Navbar /> */}
      <Hero />
    </>
  );
}

export default App;
