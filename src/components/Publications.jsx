import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { publications } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const PublicationCard = ({ index, title, description, icon }) => (
  <div style={{
    background: '#ffffff',
    border: '2px solid',
    borderColor: '#808080 #ffffff #ffffff #808080',
    padding: '8px',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = '#000080';
    e.currentTarget.style.color = 'white';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = '#ffffff';
    e.currentTarget.style.color = 'black';
  }}>
    <img
      src={icon}
      alt="paper"
      style={{
        width: '16px',
        height: '16px',
        imageRendering: 'pixelated'
      }}
    />
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{title}</div>
      {description && (
        <div style={{ fontSize: '11px', marginTop: '2px', opacity: 0.8 }}>
          {description}
        </div>
      )}
    </div>
  </div>
);

const Publication = () => {
  const [selectedPub, setSelectedPub] = useState(null);

  return (
    <div className="win95-window" style={{ 
      margin: '20px auto',
      maxWidth: '1200px',
      marginTop: '60px'
    }}>
      <div className="win95-title-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>📚</span>
          <span>Publications - Windows Explorer</span>
        </div>
        <div style={{ display: 'flex' }}>
          <button className="win95-minimize-button">_</button>
          <button className="win95-close-button">✕</button>
        </div>
      </div>
      
      <div className="win95-window-inner">
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          gap: '2px',
          padding: '4px',
          borderBottom: '2px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          marginBottom: '4px'
        }}>
          <button className="win95-button" style={{ fontSize: '12px' }}>
            ← Back
          </button>
          <button className="win95-button" style={{ fontSize: '12px' }}>
            → Forward
          </button>
          <button className="win95-button" style={{ fontSize: '12px' }}>
            ↑ Up
          </button>
          <div style={{
            borderLeft: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            marginLeft: '4px',
            marginRight: '4px'
          }}></div>
          <button className="win95-button" style={{ fontSize: '12px' }}>
            ✂️ Cut
          </button>
          <button className="win95-button" style={{ fontSize: '12px' }}>
            📋 Copy
          </button>
          <button className="win95-button" style={{ fontSize: '12px' }}>
            📄 Paste
          </button>
        </div>

        {/* Address Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          gap: '8px',
          borderBottom: '2px solid',
          borderColor: '#808080 #ffffff #ffffff #808080'
        }}>
          <span style={{ fontSize: '12px' }}>Address:</span>
          <div className="win95-inset" style={{ 
            flex: 1,
            padding: '2px 4px',
            fontSize: '12px'
          }}>
            C:\Users\Matthew\Documents\Publications
          </div>
        </div>

        <div style={{ display: 'flex', height: '500px' }}>
          {/* Sidebar */}
          <div style={{
            width: '200px',
            borderRight: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            padding: '8px',
            background: '#ffffff'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
              Folders
            </div>
            <div style={{ fontSize: '12px' }}>
              <div style={{ padding: '2px 0' }}>📁 All Publications</div>
              <div style={{ padding: '2px 0', paddingLeft: '16px' }}>📄 Research Papers</div>
              <div style={{ padding: '2px 0', paddingLeft: '16px' }}>📄 Conference Papers</div>
              <div style={{ padding: '2px 0', paddingLeft: '16px' }}>📄 Journal Articles</div>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, padding: '8px', overflow: 'auto' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: '1px solid #808080',
              paddingBottom: '4px',
              marginBottom: '8px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              <span style={{ flex: 3 }}>Name</span>
              <span style={{ width: '80px' }}>Size</span>
              <span style={{ width: '80px' }}>Type</span>
              <span style={{ width: '120px' }}>Modified</span>
            </div>

            {publications.map((pub, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  background: selectedPub === index ? '#000080' : 'transparent',
                  color: selectedPub === index ? 'white' : 'black'
                }}
                onClick={() => setSelectedPub(index)}
                onDoubleClick={() => {
                  alert(`Opening: ${pub.title}\n\n${pub.description || 'No description available'}`);
                }}
              >
                <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <img src={pub.icon} alt="doc" style={{ width: '16px', height: '16px' }} />
                  <span>{pub.title}</span>
                </div>
                <span style={{ width: '80px' }}>2.4 KB</span>
                <span style={{ width: '80px' }}>PDF File</span>
                <span style={{ width: '120px' }}>1/15/2025</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <div style={{
          borderTop: '2px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          padding: '2px 8px',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{publications.length} object(s)</span>
          <span>{selectedPub !== null ? 'Selected' : 'Ready'}</span>
        </div>
      </div>
    </div>
  );
};

export default Publication;