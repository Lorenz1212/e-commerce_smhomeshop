import React, { FC, useState, useEffect } from "react";
import "./Popup.css";

interface Props {
  body: any;
  show: boolean;
  onClose: () => void;
}

const Popup: FC<Props> = ({ body, show, onClose }) => {
  const [showPopup, setShowPopup] = useState(show);
  const [fadeOut, setFadeOut] = useState(!show);

  useEffect(() => {
    if (show) {
      setShowPopup(true);
      setFadeOut(false);
    } else {
      setShowPopup(false);
    }
  }, [show]);

  const handleClose = () => {
    setFadeOut(true);
    setTimeout(() => {
      onClose();          // ✅ call the callback
      setShowPopup(false);
    }, 300);
  };

  return (
    showPopup && (
      <div className="popup-overlay">
        <div className={`popup-content ${fadeOut ? "fade-out" : ""}`}>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
          {body}
        </div>
      </div>
    )
  );
};

export default Popup;
