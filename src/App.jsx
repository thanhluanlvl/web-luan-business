import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PdfTools from './pages/PdfTools';
import PhotocopierRental from './pages/PhotocopierRental';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pdf-tools" element={<PdfTools />} />
        <Route path="/cho-thue-may-photocopy-an-duong" element={<PhotocopierRental />} />
      </Routes>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
