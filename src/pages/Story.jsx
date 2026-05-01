import React from 'react';

export default function Story({ goTo }) {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a5f84',
      color: '#e8f5fa',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontWeight: 300, letterSpacing: '0.1em', marginBottom: '12px' }}>Our Story</h1>
      <p style={{ color: 'rgba(232,245,250,0.6)', fontSize: '15px' }}>Coming soon.</p>
      <button
        onClick={() => goTo('home')}
        style={{
          marginTop: '32px',
          background: 'transparent',
          border: '1px solid rgba(232,245,250,0.3)',
          color: '#e8f5fa',
          padding: '10px 28px',
          borderRadius: '24px',
          cursor: 'pointer',
          fontSize: '14px',
          letterSpacing: '0.05em'
        }}
      >
        Back
      </button>
    </div>
  );
}
