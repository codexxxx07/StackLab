import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
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
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
