import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  Publications,
  Test,
} from "./components";
// <Experience />
// <Tech />
// <Works />
// <Feedbacks />

// <div className="relative z-0">
//   <Contact />
//   <StarsCanvas />
// </div>
const App = () => {

  const canvasRef = useRef();

  return (
    
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
        </div>
        {//the different routes to other pages in my portfolio. Originally it was a single page application with scrolling to other
        //portions of the page like :
        }
        {
        // <Experience />
        // <Tech />
        // <Works />
        // <Feedbacks />
        // <div className="relative z-0">
        //   <Contact />
        //   <StarsCanvas />
        // </div>
        }
        <Routes>
          <Route path="/test" element={<Test />}></Route>
          <Route path="/publications" element={<Publications />}></Route>
          <Route path ="/about" element={<About />}></Route>
          <Route exact path ="/" element={<Hero />}></Route>
        </Routes>
      </div>
    
  );
};

export default App;
