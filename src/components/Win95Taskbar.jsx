import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navLinks } from '../constants';

const Win95Taskbar = ({ activeWindow }) => {
    const navigate = useNavigate();
    const [showStartMenu, setShowStartMenu] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <>
            {/* Start Menu */}
            {showStartMenu && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '0',
                    width: '250px',
                    background: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#ffffff #000000 #000000 #ffffff',
                    boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.25)',
                    zIndex: 10000
                }}>
                    <div style={{
                        background: 'linear-gradient(180deg, #000080 0%, #1084d0 100%)',
                        color: 'white',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        height: '60px'
                    }}>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 0 rgba(0, 0, 0, 0.5)'
                        }}>
                            Windows 95
                        </span>
                    </div>

                    <div style={{ padding: '2px' }}>
                        {navLinks.map((nav) => (
                            <div
                                key={nav.id}
                                className="win95-menu-item"
                                onClick={() => {
                                    navigate(`/${nav.id}`);
                                    setShowStartMenu(false);
                                }}
                                style={{
                                    padding: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#000080';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'black';
                                }}
                            >
                                <span style={{ width: '24px' }}>📁</span>
                                <span>{nav.title}</span>
                            </div>
                        ))}

                        <div style={{
                            borderTop: '2px solid',
                            borderColor: '#808080 #ffffff #ffffff #808080',
                            margin: '4px 0'
                        }}></div>

                        <div
                            className="win95-menu-item"
                            onClick={() => {
                                navigate('/');
                                setShowStartMenu(false);
                            }}
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000080';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'black';
                            }}
                        >
                            <span style={{ width: '24px' }}>🏠</span>
                            <span>Home</span>
                        </div>

                        <div style={{
                            borderTop: '2px solid',
                            borderColor: '#808080 #ffffff #ffffff #808080',
                            margin: '4px 0'
                        }}></div>

                        <div
                            className="win95-menu-item"
                            style={{
                                padding: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#000080';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'black';
                            }}
                        >
                            <span style={{ width: '24px' }}>🔌</span>
                            <span>Shut Down...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Taskbar */}
            <div className="win95-taskbar" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: '28px',
                background: '#c0c0c0',
                borderTop: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                zIndex: 9999,
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {/* Start Button */}
                    <button
                        className="win95-start-button"
                        onClick={() => setShowStartMenu(!showStartMenu)}
                        style={{
                            background: '#c0c0c0',
                            border: '2px solid',
                            borderColor: '#ffffff #000000 #000000 #ffffff',
                            padding: '2px 6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            height: '22px'
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.borderColor = '#000000 #ffffff #ffffff #000000';
                        }}
                        onMouseUp={(e) => {
                            e.currentTarget.style.borderColor = '#ffffff #000000 #000000 #ffffff';
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>🪟</span>
                        <span>Start</span>
                    </button>

                    {/* Quick Launch */}
                    <div style={{
                        borderLeft: '2px solid',
                        borderColor: '#808080 #ffffff #ffffff #808080',
                        height: '22px',
                        marginLeft: '4px'
                    }}></div>

                    <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                        <button className="win95-button" style={{
                            padding: '2px 4px',
                            height: '22px',
                            width: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            🌐
                        </button>
                        <button className="win95-button" style={{
                            padding: '2px 4px',
                            height: '22px',
                            width: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            📧
                        </button>
                    </div>

                    {/* Active Windows */}
                    {activeWindow && activeWindow !== 'home' && (
                        <div style={{
                            marginLeft: '8px',
                            background: '#dfdfdf',
                            border: '2px solid',
                            borderColor: '#000000 #ffffff #ffffff #000000',
                            padding: '2px 8px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            height: '22px',
                            minWidth: '150px'
                        }}>
                            <span>📁</span>
                            <span>{activeWindow.charAt(0).toUpperCase() + activeWindow.slice(1)}</span>
                        </div>
                    )}
                </div>

                {/* System Tray */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginRight: '4px'
                }}>
                    <div style={{
                        border: '2px solid',
                        borderColor: '#808080 #ffffff #ffffff #808080',
                        padding: '2px 8px',
                        fontSize: '12px',
                        background: '#c0c0c0',
                        height: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>🔊</span>
                        <span>🖥️</span>
                        <span>{formatTime(currentTime)}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Win95Taskbar;