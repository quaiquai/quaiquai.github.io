import React from 'react';
import { useNavigate } from 'react-router-dom';

const Win95Desktop = ({ setActiveWindow, setOpenWindows }) => {
    const navigate = useNavigate();

    const desktopIcons = [
        { id: 'about', icon: '👤', label: 'About Me', path: '/about' },
        { id: 'projects', icon: '💾', label: 'Projects', path: '/projects' },
        { id: 'publications', icon: '📄', label: 'Publications', path: '/publications' },
        { id: 'blogs', icon: '📝', label: 'Blog Posts', path: '/blogs' },
        { id: 'resources', icon: '💿', label: 'Resources', path: '/resources' },
        { id: 'wgpu', icon: '🎮', label: '3D Demo', path: '/wgpu' },
        { id: 'recycle', icon: '🗑️', label: 'Recycle Bin', path: '#' },
        { id: 'network', icon: '🌐', label: 'Network', path: '#' },
    ];

    const handleIconClick = (icon) => {
        if (icon.path !== '#') {
            setActiveWindow(icon.id);
            setOpenWindows(prev => {
                if (!prev.includes(icon.id)) {
                    return [...prev, icon.id];
                }
                return prev;
            })
            navigate(icon.path);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            display: 'grid',
            gridTemplateRows: 'repeat(auto-fill, 100px)',
            gap: '20px',
            zIndex: 1,
            height: 'calc(100vh - 60px)',
            pointerEvents: 'none'
        }}>
            {desktopIcons.map((icon) => (
                <div
                    key={icon.id}
                    className="win95-desktop-icon"
                    onClick={() => handleIconClick(icon)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px',
                        cursor: 'pointer',
                        width: '80px',
                        height: '80px',
                        userSelect: 'none',
                        pointerEvents: 'auto'
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 128, 0.3)';
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <div style={{
                        fontSize: '32px',
                        filter: 'drop-shadow(1px 1px 0 black)'
                    }}>
                        {icon.icon}
                    </div>
                    <span style={{
                        color: 'white',
                        fontSize: '11px',
                        textShadow: '1px 1px 0 black',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        maxWidth: '70px'
                    }}>
                        {icon.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default Win95Desktop;