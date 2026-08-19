import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import AppHeader from '../components/AppHeader/AppHeader';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '../features/auth/AuthContext';

import AddBookPage from '../pages/AddBookPage/AddBookPage';
import BookChatPage from '../pages/BookChatPage/BookChatPage';
import CommonBooksPage from '../pages/CommonBooksPage/CommonBooksPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import MyBooksPage from '../pages/MyBooksPage/MyBooksPage';
import RegisterPage from '../pages/RegisterPage/RegisterPage';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isPublicPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  const showAppChrome =
    isAuthenticated && !isPublicPage;

  return (
    <div className="app">
      {showAppChrome && <AppHeader />}

      <main className="app__content">
        <Routes>
          <Route
            path="/login"
            element={<LoginPage />}
          />

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
            element={
              <Navigate
                to="/books"
                replace
              />
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/books"
                replace
              />
            }
          />
        </Routes>
      </main>

      {showAppChrome && (
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
      )}
    </div>
  );
}

export default App;