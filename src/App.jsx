import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PdfTools from './pages/PdfTools';
import PhotocopierRental from './pages/PhotocopierRental';
import PrinterKnowledge from './pages/PrinterKnowledge';
import PrinterArticle from './pages/PrinterArticle';
import { printerArticles } from './data/printerArticles';
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
        <Route path="/kien-thuc-may-in-an-duong" element={<PrinterKnowledge />} />
        {printerArticles.map((article) => (
          <Route key={article.slug} path={`/${article.slug}`} element={<PrinterArticle article={article} />} />
        ))}
      </Routes>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
