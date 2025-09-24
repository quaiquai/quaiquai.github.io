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

  return (
    <div className="win95-desktop" style={{
      minHeight: '100vh',
      background: '#008080',
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.1) 2px,
        rgba(0, 0, 0, 0.1) 4px
      )`,
      paddingBottom: '32px',
    }}>
      <Win95Desktop setActiveWindow={setActiveWindow} />

      <div style={{ padding: '20px', paddingBottom: '50px'}}>
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