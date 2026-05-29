import "../styles/Modal.css";

export default function Modal({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p className="modal-message">{message}</p>
        <button className="modal-button" onClick={onClose}>
          Okej
        </button>
      </div>
    </div>
  );
}
