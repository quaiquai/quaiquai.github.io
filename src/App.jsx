import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import {
  About,
  Experience,
  Hero,
  Navbar,
  Works,
  StarsCanvas,
  Publications,
  ReactWebGPUTutorial,
  ResourceView,
  // Test,
  BlogsList,
} from "./components";
import SpinningCube from "./wgpu/samples/simpleCube";
import PathTraceSphere from "./wgpu/samples/path-tracing/trace";

const App = () => {

  const canvasRef = useRef();

  return (
    
      <div className="relative z-0">
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
          {/* <Route path="/test" element={<Test />}></Route> */}
          <Route path="/publications" element={<Publications />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/resources" element={<ResourceView />}></Route>
          <Route path="/projects" element={<Works />}></Route>
          <Route exact path="/" element={<Hero />}></Route>
          <Route exact path="/tut" element={<ReactWebGPUTutorial />}></Route>
          <Route exact path="/blogs" element={<BlogsList/>}></Route>
          <Route exact path="/wgpu" element={<PathTraceSphere></PathTraceSphere>}></Route>
        </Routes>
      </div>
    
  );
};

export default App;
