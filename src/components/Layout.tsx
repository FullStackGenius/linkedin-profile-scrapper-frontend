// components/Layout.tsx
import type { ReactNode } from 'react';
import Header from './Navbar';
import Footer from './Footer';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-1">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
