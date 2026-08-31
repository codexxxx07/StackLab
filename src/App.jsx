import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClickSpark from './components/ClickSpark';
import SkeletonLoader from './components/SkeletonLoader';
import Antigravity from './components/Antigravity';
import { useLenis } from './hooks/useLenis';
import Home from './pages/Home';
import InfixToPostfix from './pages/InfixToPostfix';
import PostfixToInfix from './pages/PostfixToInfix';
import InfixToPrefix from './pages/InfixToPrefix';
import PrefixToInfix from './pages/PrefixToInfix';
import PostfixToPrefix from './pages/PostfixToPrefix';
import PrefixToPostfix from './pages/PrefixToPostfix';
import About from './pages/About';

function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);
  return null;
}

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [fadeState, setFadeState] = useState('skeleton');

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeState('transitioning');
      setTimeout(() => {
        setLoading(false);
        setFadeState('content');
      }, 150);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div
          className={`fixed inset-0 z-9999 transition-opacity duration-150 ${
            fadeState === 'transitioning' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <SkeletonLoader />
        </div>
      )}
      <div
        className={`transition-opacity duration-150 ${
          fadeState === 'content' ? 'opacity-100' : fadeState === 'transitioning' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="pointer-events-none fixed inset-0 z-0 opacity-30 dark:opacity-20">
          <Antigravity
            count={250}
            magnetRadius={8}
            ringRadius={9}
            waveSpeed={0.3}
            waveAmplitude={0.8}
            particleSize={1.2}
            lerpSpeed={0.04}
            color="#f97316"
            autoAnimate={true}
            particleVariance={0.8}
            rotationSpeed={0.1}
            depthFactor={0.8}
            pulseSpeed={2}
            particleShape="sphere"
            fieldStrength={8}
          />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/infix-to-postfix" element={<InfixToPostfix />} />
              <Route path="/postfix-to-infix" element={<PostfixToInfix />} />
              <Route path="/infix-to-prefix" element={<InfixToPrefix />} />
              <Route path="/prefix-to-infix" element={<PrefixToInfix />} />
              <Route path="/postfix-to-prefix" element={<PostfixToPrefix />} />
              <Route path="/prefix-to-postfix" element={<PrefixToPostfix />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ClickSpark
        sparkColor="#f97316"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={8}
        duration={400}
        easing="ease-out"
      >
        <AppContent />
      </ClickSpark>
    </Router>
  );
}
