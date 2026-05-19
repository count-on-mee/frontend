import Header from '../components/Header';
import MobileHeader from '../components/navigation/mobileHeader';
import BottomNavigation from '../components/navigation/bottomNavigation';
import Footer from '../components/footer';

export default function AppShell({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden desktop:block">
        <Header />
      </div>

      <MobileHeader />

      <main className="flex-grow pb-16 desktop:pb-0">{children}</main>

      <div className="hidden desktop:block">
        <Footer />
      </div>

      <BottomNavigation />
    </div>
  );
}
