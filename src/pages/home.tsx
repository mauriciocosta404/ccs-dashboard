
import Navbar from '../components/landing-page/Navbar';
import Hero from '../components/landing-page/Hero';
import AboutPastor from '../components/landing-page/AboutPastor';
import About from '../components/landing-page/About';
import Services from '../components/landing-page/Services';
import Events from '../components/landing-page/Events';
import Gallery from '../components/landing-page/Gallery';
import Contact from '../components/landing-page/Contact';
import { Maps } from '../components/landing-page/map';
import Footer from '../components/landing-page/footer';
import AIChat from '../components/landing-page/AIChat';

function LandigPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AboutPastor />
      <About />
      <Services />
      <Events />
      <Gallery />
      <Contact />
      <Maps/>
      <Footer/>
      <AIChat />
    </div>
  );
}

export default LandigPage;