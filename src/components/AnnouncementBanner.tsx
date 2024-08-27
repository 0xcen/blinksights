// components/AnnouncementBanner.js
import React from 'react';

const AnnouncementBanner = ({ message }: { message: string }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      color: '#000',
      textAlign: 'center',
      padding: '10px',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
    }}>
      <p>{message}</p>
    </div>
  );
};

export default AnnouncementBanner;
