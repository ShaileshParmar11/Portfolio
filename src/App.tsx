import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { Nav } from './components/Nav';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Stats } from './components/Stats';

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Marquee />
      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
