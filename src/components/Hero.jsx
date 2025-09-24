import { motion } from "framer-motion";
import { profile_picture} from "../assets";
import { ComputersCanvas } from "./canvas";

const Hero = () => {
  return (
    <div className="win95-window" style={{ 
      margin: '20px auto',
      maxWidth: '1200px',
      marginTop: '10px',
      overflowY: 'auto',
    }}>
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
                    <strong>Name:</strong> Matthew McQuaigue<br/>
                    <strong>Title:</strong> 3D Graphics Developer<br/>
                    <strong>Specialties:</strong> WebGL, Three.js, AR/VR<br/>
                    <strong>Status:</strong> <span style={{ color: 'green' }}>● Online</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Icons */}
            {/* <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '20px',
              marginTop: '30px'
            }}>
              <div className="win95-desktop-icon" style={{ 
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                padding: '8px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '32px' }}>💻</div>
                <span style={{ fontSize: '12px' }}>My Computer</span>
              </div>
              
              <div className="win95-desktop-icon" style={{ 
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                padding: '8px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '32px' }}>🌐</div>
                <span style={{ fontSize: '12px' }}>Internet Explorer</span>
              </div>
              
              <div className="win95-desktop-icon" style={{ 
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                padding: '8px',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '32px' }}>📁</div>
                <span style={{ fontSize: '12px' }}>My Documents</span>
              </div>
            </div> */}

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