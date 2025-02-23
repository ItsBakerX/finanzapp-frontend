import React from 'react';
import './../style/Baker_CSS/Willkommenspopup.css';

interface WillkommenspopupProps {
    isOpen: boolean;
    onRequestClose: () => void;
}

const Willkommenspopup: React.FC<WillkommenspopupProps> = ({ isOpen, onRequestClose }) => {
    return (
        <div className='willkommenspopup'>
            <div id='body-overlay' className={`${isOpen ? 'sichtbar' : ''}`}>
                <div className="custom-modal__backdrop" onClick={onRequestClose}></div>
                <div className={`dialog ${isOpen ? 'sichtbar' : ''}`}>
                    <div className="popupContent">
                        <h3>Willkommen!</h3>
                        <p>Dies ist ein Willkommens-Popup. Klicken Sie auf den Button, um es zu schließen.</p>
                        <button className="close-btn" onClick={onRequestClose}>Schließen</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Willkommenspopup;