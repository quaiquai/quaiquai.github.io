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
  BlogsList,
} from "./components";
import SpinningCube from "./wgpu/samples/simpleCube";
import PathTraceSphere from "./wgpu/samples/path-tracing/trace";
import Win95Desktop from "./components/Win95Desktop";
import Win95Taskbar from "./components/Win95Taskbar";

const App = () => {
  const canvasRef = useRef();
  const [activeWindow, setActiveWindow] = useState('home');
  const [openWindows, setOpenWindows] = useState(['home']);
  
  return (
    <div className="win95-desktop">
      <Win95Desktop setActiveWindow={setActiveWindow} setOpenWindows={setOpenWindows} />

      <div style={{ padding: '20px', paddingBottom: '50px' }}>
        {/* <Navbar activeWindow={activeWindow} setActiveWindow={setActiveWindow} /> */}

        <Routes>
          <Route path="/publications" element={<Publications />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/resources" element={<ResourceView />}></Route>
          <Route path="/projects" element={<Works />}></Route>
          <Route exact path="/" element={<Hero />}></Route>
          <Route exact path="/tut" element={<ReactWebGPUTutorial />}></Route>
          <Route exact path="/blogs" element={<BlogsList />}></Route>
          <Route exact path="/wgpu" element={<PathTraceSphere></PathTraceSphere>}></Route>
        </Routes>
      </div>

      <Win95Taskbar activeWindow={activeWindow} />
    </div>
  );
};

export default App;