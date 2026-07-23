import React, { useState, useEffect } from 'react';
import goMascot from '../assets/go_mascot.svg';
import excelIcon from '../assets/excel_icon.svg';

export default function SneakyMascots({ scrollY }) {
  const [visible, setVisible] = useState(false);
  const [gopherHovered, setGopherHovered] = useState(false);
  const [excelHovered, setExcelHovered] = useState(false);

  useEffect(() => {
    // Show mascots when user scrolls down past 80px
    if (scrollY > 80) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [scrollY]);

  return (
    <>
      {/* Excel Icon on Bottom-Left */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '30px',
          zIndex: 200,
          pointerEvents: visible ? 'auto' : 'none',
          // Lurking halfway: translateY(32px) normally, translateY(0px) when hovered
          transform: `translateY(${visible ? (excelHovered ? '0px' : '32px') : '110%'}) rotate(${excelHovered ? '5deg' : '15deg'})`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: 'pointer',
          width: '90px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        onMouseEnter={() => setExcelHovered(true)}
        onMouseLeave={() => setExcelHovered(false)}
      >
        {/* Speech Bubble */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '0.72rem',
            color: '#10b981', // Excel Green
            whiteSpace: 'nowrap',
            marginBottom: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            opacity: excelHovered ? 1 : 0,
            transition: 'opacity 0.2s, transform 0.2s',
            pointerEvents: 'none',
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) scale(${excelHovered ? 1 : 0.8}) translateY(${excelHovered ? 0 : 5}px)`
          }}
        >
          Excel export is ready! 📊
        </div>
        <img
          src={excelIcon}
          alt="Excel Icon"
          style={{
            width: '65px',
            height: 'auto',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
          }}
        />
      </div>

      {/* Go Mascot (Gopher) on Bottom-Right */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          right: '30px',
          zIndex: 200,
          pointerEvents: visible ? 'auto' : 'none',
          // Lurking halfway: translateY(45px) normally, translateY(0px) when hovered
          transform: `translateY(${visible ? (gopherHovered ? '0px' : '45px') : '110%'}) rotate(${gopherHovered ? '-5deg' : '-15deg'})`,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          cursor: 'pointer',
          width: '100px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        onMouseEnter={() => setGopherHovered(true)}
        onMouseLeave={() => setGopherHovered(false)}
      >
        {/* Speech Bubble */}
        <div
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '6px 12px',
            fontSize: '0.72rem',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            marginBottom: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            opacity: gopherHovered ? 1 : 0,
            transition: 'opacity 0.2s, transform 0.2s',
            pointerEvents: 'none',
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transformOrigin: 'bottom center',
            transform: `translateX(-50%) scale(${gopherHovered ? 1 : 0.8}) translateY(${gopherHovered ? 0 : 5}px)`
          }}
        >
          Let's build reports! ⚡
        </div>
        <img
          src={goMascot}
          alt="Go Mascot"
          style={{
            width: '90px',
            height: 'auto',
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))'
          }}
        />
      </div>
    </>
  );
}
