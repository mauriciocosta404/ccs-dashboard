import { Outlet } from "react-router";
import Navbar from "../components/landing-page/Navbar";
import Footer from "../components/landing-page/footer";

const LayoutContent: React.FC = () => {

  return (
    <div className="">
        <Navbar />
        <Outlet  />
        <Footer />
    </div>
  );
};

const DefaultLayout: React.FC = () => {
  return (
    <LayoutContent />
  );
};

export default DefaultLayout;
