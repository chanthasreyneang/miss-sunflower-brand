import { FiAlertTriangle } from "react-icons/fi";
import { isFirebaseConfigured } from "../../services/firebase";
import "./FirebaseSetupBanner.css";

export default function FirebaseSetupBanner() {
  if (isFirebaseConfigured) return null;

  return (
    <div className="firebase-banner">
      <FiAlertTriangle />
      <span>
        Firebase isn't connected yet — products, accounts, and the admin dashboard are empty
        until you follow <strong>SETUP.md</strong> and add your project config to <code>.env</code>.
      </span>
    </div>
  );
}
