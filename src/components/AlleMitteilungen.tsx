import React from 'react';
import Mitteilung from './Mitteilung';

interface AlleMitteilungenProps {
  onClick: () => void;
}

const AlleMitteilungen: React.FC<AlleMitteilungenProps> = ({ onClick }) => {
  return (
    <div className="mitteilungen-overlay">
      <div className="mitteilungenHeader">
        <h2>Alle Mitteilungen</h2>
        <button className="close-btn" onClick={onClick}>X</button>
      </div>
      <Mitteilung />
    </div>
  );
};

export default AlleMitteilungen;