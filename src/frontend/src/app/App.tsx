import { Navigate, Route, Routes } from 'react-router-dom';

import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import AddBookPage from '../pages/AddBookPage/AddBookPage';
import CommonBooksPage from '../pages/CommonBooksPage/CommonBooksPage';
import MyBooksPage from '../pages/MyBooksPage/MyBooksPage';

function App() {
  return (
    <div className="app">
      <main className="app__content">
        <Routes>
          <Route path="/" element={<Navigate to="/books" replace />} />

          <Route path="/books" element={<CommonBooksPage />} />

          <Route path="/my-books" element={<MyBooksPage />} />

          <Route path="/add-book" element={<AddBookPage />} />
        </Routes>
      </main>

      <BottomNavigation />
    </div>
  );
}

export default App;