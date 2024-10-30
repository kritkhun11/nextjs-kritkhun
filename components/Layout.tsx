
import React, { ReactNode } from 'react';
import Link from 'next/link';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <nav style={styles.nav}>
        <div style={styles.navContainer}>
          <div style={styles.navLinks}>
            <Link href="/group/ServerGroupList" passHref>
              <p style={styles.link}>กลุ่มเซิฟเวอร์</p>
            </Link>
            {/* <Link href="/about" passHref>
              <p style={styles.link}>About</p>
            </Link>
            <Link href="/contact" passHref>
              <p style={styles.link}>Contact</p>
            </Link> */}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

const styles = {
  nav: {
    backgroundColor: '#333',
    padding: '1rem 2rem',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'flex-end', 
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem', 
  },
  link: {
    color: '#f0f0f0',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'color 0.3s',
  },
};

export default Layout;
