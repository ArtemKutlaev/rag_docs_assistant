import { useLocation } from 'react-router-dom';

import AccountMenu from '../AccountMenu/AccountMenu';

import styles from './AppHeader.module.css';

function AppHeader() {
  const location = useLocation();

  const isChatPage = location.pathname.includes('/chat');

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>R</span>

        {!isChatPage && (
          <span className={styles.name}>
            RAG Docs Assistant
          </span>
        )}
      </div>

      <AccountMenu />
    </header>
  );
}

export default AppHeader;