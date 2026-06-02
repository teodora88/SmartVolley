import "../styles/Modal.css";

export default function Modal({
  message,
  onClose,
  onConfirm,
  confirmLabel = "Obriši",
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p className="modal-message">{message}</p>
        <div className="modal-buttons">
          {onConfirm ? (
            <>
              <button className="btn-primary" onClick={onClose}>
                Otkaži
              </button>
              <button className="btn-danger" onClick={onConfirm}>
                {confirmLabel}
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={onClose}>
              Okej
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
