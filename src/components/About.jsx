import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt>
  <div className="win95-window" style={{ width: '250px', marginBottom: '20px'}}>
    <div className="win95-title-bar">
      <span>{title}.exe</span>
      <button className="win95-close-button">✕</button>
    </div>
    <div className="win95-window-inner" style={{ 
      padding: '16px',
      textAlign: 'center',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img
        src={icon}
        alt={title}
        style={{
          width: '64px',
          height: '64px',
          imageRendering: 'pixelated',
          marginBottom: '16px'
        }}
      />
      <h3 style={{ 
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#000080'
      }}>
        {title}
      </h3>
    </div>
  </div>
  </Tilt>
);

const About = () => {
  return (
    <div className="win95-window" style={{ 
      maxWidth: '1200px',
      maxHeight: '80vh',
      overflowY: 'auto',
    }}>
      <div className="win95-title-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>👤</span>
          <span>About.txt - Notepad</span>
        </div>
        <div style={{ display: 'flex' }}>
          <button className="win95-minimize-button">_</button>
          <button className="win95-close-button">✕</button>
        </div>
      </div>
      
      <div className="win95-window-inner">
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
          <span className="win95-link">Search</span>
          <span className="win95-link">Help</span>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Service Cards */}
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
            justifyContent: 'center'
          }}>
            {services.map((service, index) => (
              <ServiceCard key={service.title} index={index} {...service} />
            ))}
          </div>

          {/* Main Content */}
          <div className="win95-inset" style={{ padding: '16px' }}>
            <div style={{
              fontFamily: 'Courier New, monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#000000'
            }}>
              <h2 style={{ 
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '8px',
                color: '#000080'
              }}>
                ==================================================<br/>
                MATTHEW MCQUAIGUE - SYSTEM INFORMATION<br/>
                ==================================================
              </h2>

              <div style={{ marginBottom: '16px' }}>
                <strong>[OVERVIEW]</strong><br/>
                ──────────────────────────────────────────────<br/>
                Hello! I hold a Ph.D. in Computer Science from the University of North Carolina at Charlotte,
                where my research focuses on egocentric depth perception in AR/VR. My work explores how different depth cues and rendering
                techniques influence perception accuracy in immersive environments.<br/><br/>
                
                I am also part of a team developing the BRIDGES and CS-Materials interactive learning technologies<br/>
                • https://cs-materials.herokuapp.com/<br/>
                • https://bridgesuncc.github.io/
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>[PROFESSIONAL EXPERIENCE]</strong><br/>
                ──────────────────────────────────────────────<br/>
                ► Developer and Researcher for BRIDGES/CS-Materials in Charlotte, NC<br/>
                ► Lecturer at the University of North Carolina at Charlotte<br/>
                  - Data Structures and Algorithms<br/>
                  - Graduate Teaching Assistant for Introduction to Computer Graphics<br/>
                ► PhD Candidate - Computer Science, UNC Charlotte<br/>
                  - Research: Egocentric depth perception in VR/AR<br/>
                  - Developing: AR/VR Perceptual Matching Framework<br/>
                  - Real-time HoloLens Light Position Acquisition and IBL<br/>
                  - BRIDGES 3D rendering engine for CS education
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>[RESEARCH FOCUS]</strong><br/>
                ──────────────────────────────────────────────<br/>
                My work has focused on understanding how physically based rendering (PBR) and global illumination affect depth perception
                in AR by using HoloLens 2 sensor stream data for PBR-based rendering. I have designed and executed multiple human subject
                experiments to evaluate how graphical realism and visual congruence impact depth perception.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>[EDUCATIONAL PROJECTS]</strong><br/>
                ──────────────────────────────────────────────<br/>
                BRIDGES (https://bridgesuncc.github.io/) - An online computer science education tool used to provide early CS students 
                with an easy-to-use API to visualize complex data structures and help increase learning engagement with the use of 
                real-world data sets. Used by more than 10,000 students.
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>[TECHNICAL EXPERTISE]</strong><br/>
                ──────────────────────────────────────────────<br/>
                • Full-stack web development<br/>
                • Distributed systems<br/>
                • High-performance rendering<br/>
                • React, Flask, Node.js, PostgreSQL, AWS<br/>
                • OpenGL, WebGL, Vulkan, Unity<br/>
                • RESTful APIs<br/>
                • Data visualization pipelines<br/>
                • Client-server architectures
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>[ACHIEVEMENTS]</strong><br/>
                ──────────────────────────────────────────────<br/>
                ✓ GSSF Funding<br/>
                ✓ Atkins Undergraduate Research Award<br/>
                ✓ CCI High Achieving Award<br/>
                ✓ CCI Research Scholar<br/>
                ✓ Published peer-reviewed papers on CS education<br/>
                ✓ Master's Degree - Computer Science (Visualization)<br/>
                ✓ Bachelor's Degree - Computer Science
              </div>

              <div style={{ 
                marginTop: '24px',
                padding: '8px',
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#808080 #ffffff #ffffff #808080'
              }}>
                <strong>EOF</strong> - End of file reached.<br/>
                Press any key to continue...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");