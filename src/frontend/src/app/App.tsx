import { Navigate, Route, Routes } from 'react-router-dom';

import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

import AddBookPage from '../pages/AddBookPage/AddBookPage';
import BookChatPage from '../pages/BookChatPage/BookChatPage';
import CommonBooksPage from '../pages/CommonBooksPage/CommonBooksPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import MyBooksPage from '../pages/MyBooksPage/MyBooksPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';

function App() {
  return (
    <div className="app">
      <main className="app__content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <CommonBooksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-books"
            element={
              <ProtectedRoute>
                <MyBooksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-book"
            element={
              <ProtectedRoute>
                <AddBookPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/books/:bookId/chat"
            element={
              <ProtectedRoute>
                <BookChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={<Navigate to="/books" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/books" replace />}
          />
        </Routes>
      </main>

      <Routes>
        <Route
          path="/books"
          element={<BottomNavigation />}
        />

        <Route
          path="/my-books"
          element={<BottomNavigation />}
        />

        <Route
          path="/add-book"
          element={<BottomNavigation />}
        />
      </Routes>
    </div>
  );
}

export default App;