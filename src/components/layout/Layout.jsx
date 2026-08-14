import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../common/ScrollToTop";
import FirebaseSetupBanner from "./FirebaseSetupBanner";

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <FirebaseSetupBanner />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
