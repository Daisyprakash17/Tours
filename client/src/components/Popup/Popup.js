const Popup = ({ onClose, children }) => {
  return (
    <div className="popup">
      <div className="popup__content">
        <div className="popup__close" onClick={onClose}>
          &times;
        </div>
        {children}
      </div>
    </div>
  );
};

export default Popup;
