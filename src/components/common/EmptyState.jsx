import { FiInbox } from "react-icons/fi";
import "./EmptyState.css";

export default function EmptyState({ icon, title = "Nothing here yet", message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon || <FiInbox />}</div>
      <h4>{title}</h4>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}
