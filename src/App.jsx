import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import PdfTools from './pages/PdfTools';
import PhotocopierRental from './pages/PhotocopierRental';
import PrinterKnowledge from './pages/PrinterKnowledge';
import PrinterArticle from './pages/PrinterArticle';
import AdvertisingKnowledge from './pages/AdvertisingKnowledge';
import { printerArticles } from './data/printerArticles';
import { advertisingArticles } from './data/advertisingArticles';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ScrollToTop from './components/ScrollToTop';

const advertisingArticleContext = {
  articles: advertisingArticles,
  collectionPath: '/kien-thuc-in-an-quang-cao-an-duong',
  collectionLabel: 'Kiến thức in ấn & biển hiệu',
  localTitle: 'Cần in ấn hoặc làm biển hiệu?',
  localDescription: 'Gửi kích thước, nội dung và ảnh mặt bằng qua Zalo để được gợi ý vật liệu, bố cục và phương án thi công phù hợp trước khi sản xuất.',
  relatedTitle: 'Bài viết in ấn và biển hiệu liên quan',
  pageClass: 'advertising-article-page',
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pdf-tools" element={<PdfTools />} />
        <Route path="/cho-thue-may-photocopy-an-duong" element={<PhotocopierRental />} />
        <Route path="/kien-thuc-may-in-an-duong" element={<PrinterKnowledge />} />
        <Route path="/kien-thuc-in-an-quang-cao-an-duong" element={<AdvertisingKnowledge />} />
        {printerArticles.map((article) => (
          <Route key={article.slug} path={`/${article.slug}`} element={<PrinterArticle article={article} />} />
        ))}
        {advertisingArticles.map((article) => (
          <Route key={article.slug} path={`/${article.slug}`} element={<PrinterArticle article={article} context={advertisingArticleContext} />} />
        ))}
      </Routes>
      <Footer />
      <Chatbot />
    </BrowserRouter>
  );
}

export default App;
