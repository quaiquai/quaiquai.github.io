import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { profile_picture } from "../assets";
import { ComputersCanvas } from "./canvas";
import { useDraggable } from "../hooks/useDraggable";
import { use } from "react";

const Hero = () => {
  const draggableRef = useDraggable(20, 0);

  return (
    <div
      ref={draggableRef}
      className="win95-window"
      style={{
        position: "relative",   // <-- this is key
        maxWidth: "1200px",
        marginTop: "10px",
        overflowY: "auto",
        cursor: "grab",        // <-- start with grab cursor
      }}
    >
      <div className="win95-title-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🏠</span>
          <span>Matthew McQuaigue - Portfolio.exe</span>
        </div>
        <div style={{ display: 'flex' }}>
          <button className="win95-minimize-button">_</button>
          <button className="win95-close-button">✕</button>
        </div>
      </div>

      <div className="win95-window-inner" style={{ padding: '8px' }}>
        {/* Menu Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: '4px 8px',
          borderBottom: '2px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          marginBottom: '8px'
        }}>
          <span className="win95-link">File</span>
          <span className="win95-link">Edit</span>
          <span className="win95-link">View</span>
          <span className="win95-link">Help</span>
        </div>

        {/* Content Area */}
        <div className="win95-inset" style={{
          minHeight: '500px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              {profile_picture && (
                <div style={{
                  width: '100px',
                  height: '100px',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  padding: '4px',
                  background: 'white'
                }}>
                  <img
                    src={profile_picture}
                    alt="Matthew McQuaigue"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      imageRendering: 'auto'
                    }}
                  />
                </div>
              )}

              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#000080',
                  marginBottom: '8px'
                }}>
                  Welcome to Windows 95 Portfolio
                </h1>
                <div style={{
                  background: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#808080 #ffffff #ffffff #808080',
                  padding: '8px',
                  marginTop: '8px'
                }}>
                  <p className="win95-text">
                    <strong>Name:</strong> Matthew McQuaigue<br />
                    <strong>Title:</strong> 3D Graphics Developer<br />
                    <strong>Specialties:</strong> WebGL, Three.js, AR/VR<br />
                    <strong>Status:</strong> <span style={{ color: 'green' }}>● Online</span>
                  </p>
                </div>
              </div>
            </div>
            {/* 3D Canvas Container */}
            <div style={{
              marginTop: '20px',
              border: '2px solid',
              borderColor: '#808080 #ffffff #ffffff #808080',
              background: 'black',
              height: '400px',
              position: 'relative'
            }}>
              <div className="win95-title-bar" style={{ position: 'relative' }}>
                <span>3D Viewer - OpenGL</span>
              </div>
              <div style={{ height: 'calc(100% - 22px)' }}>
                <ComputersCanvas />
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div style={{
          borderTop: '2px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          padding: '2px 8px',
          fontSize: '12px',
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Ready</span>
          <span>Objects: 1 | Polygons: 1024</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;