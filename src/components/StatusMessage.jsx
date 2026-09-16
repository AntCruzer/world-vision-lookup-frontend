import "./StatusMessage.css";

function StatusMessage({
  title,
  message,
  actionText,
  onAction,
}) {
  return (
    <section className="status-message">
      <h2 className="status-message__title">
        {title}
      </h2>

      {message && (
        <p className="status-message__text">
          {message}
        </p>
      )}

      {actionText && onAction && (
        <button
          type="button"
          className="status-message__button"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </section>
  );
}

export default StatusMessage;