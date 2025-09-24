import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";

const Navbar = ({ activeWindow, setActiveWindow }) => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      {/* Start Menu */}
      {(
        <div 
          className="win95-menu"
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '2px',
            height: '95%',
            width: '200px',
            zIndex: 1000,
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#ffffff #000000 #000000 #ffffff',
            boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.25)'
          }}
        >
          <div style={{ 
            background: '#000080',
            color: 'white',
            padding: '4px 8px',
            marginBottom: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              writingMode: 'vertical-lr',
              transform: 'rotate(180deg)',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              Portfolio 95
            </span>
          </div>
          
          {navLinks.map((nav) => (
            <Link 
              key={nav.id}
              to={`/${nav.id}`}
              onClick={() => {
                setToggle(false);
                setActiveWindow(nav.id);
              }}
            >
              <div className="win95-menu-item">
                <span style={{ marginRight: '8px' }}>📁</span>
                {nav.title}
              </div>
            </Link>
          ))}
          
          <div style={{ 
            borderTop: '2px solid',
            borderColor: '#808080 #ffffff #ffffff #808080',
            margin: '2px 0'
          }}></div>
          
          <Link to="/" onClick={() => {
            setToggle(false);
            setActiveWindow('home');
          }}>
            <div className="win95-menu-item">
              <span style={{ marginRight: '8px' }}>🏠</span>
              Home
            </div>
          </Link>
        </div>
      )}

      {/* Mobile Menu Button (Floating) */}
      <div 
        className="sm:hidden"
        style={{
          position: 'fixed',
          bottom: '36px',
          left: '4px',
          zIndex: 999
        }}
      >
        <button 
          className="win95-start-button"
          onClick={() => setToggle(!toggle)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px'
          }}
        >
          <span style={{ fontSize: '16px' }}>🪟</span>
          <span style={{ fontWeight: 'bold' }}>Start</span>
        </button>
      </div>
    </>
  );
};

export default Navbar;