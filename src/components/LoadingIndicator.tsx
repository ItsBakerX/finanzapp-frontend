import './../style/Baker_CSS/LoadingIndicator.css';

export function LoadingIndicator({ size = "medium", color = "primary", message = "Loading...", showMessage = true, position = "" }) {
    return (
        <div className="loading-indicator">
            <div className={`spinner ${size} ${color} ${position}`} />
            {showMessage && <p className="loading-message">{message}</p>}
        </div>
    );
}