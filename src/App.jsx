import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import useInitializeUser from './hooks/useInitializeUser';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import MyPage from './pages/MyPage';
import CalendarPage from './pages/CalendarPage';
import DestinationListPage from './pages/DestinationListPage';
import SpotPage from './pages/SpotPage';
import CurationPage from './pages/CurationPage';
import MapLayout from './layouts/MapLayout';
import COMLayout from './layouts/ComLayout';
import Itinerary from './components/Itinerary';
import Details from './components/Details';
import MyScrapListPage from './pages/MyScrapListPage';
import MyTripListPage from './pages/MyTripListPage';
import { RecoilRoot } from 'recoil';
import SupportLayout from './layouts/SupportLayout';
import Notice from './components/Notice';
import NoticeDetail from './pages/NoticeDetailsPage';
import FAQ from './components/FAQ';
import Inquiry from './components/Inquiry';
import InquiryPage from './pages/InquiryPage';
import InquiryDetail from './pages/InquiryDetailsPage';

function App() {
  return (
    <RecoilRoot>
      <InitializeUserWrapper />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/me" element={<MyPage />} />
        <Route path="/com" element={<COMLayout />}>
              <Route path="my-trip-list" element={<MyTripListPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route
                path="destination-list"
                element={<DestinationListPage />}
              />
              <Route path="my-scrap-list" element={<MyScrapListPage />} />
              <Route path=":tripId">
                <Route path="itinerary" element={<Itinerary />} />
                <Route path="details" element={<Details />} />
              </Route>
<<<<<<< HEAD
            </Route>
            <Route path="/map" element={<MapLayout />}>
              <Route path="spot" element={<SpotPage />} />
              <Route path="curation" element={<CurationPage />} />
            </Route>
            <Route path="/support" element={<SupportLayout />}>
              <Route index element={<Notice />} />
              <Route path="notice" element={<Notice />} />
              <Route path="notice/:id" element={<NoticeDetail />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="inquiry" element={<Inquiry />} />
              <Route path="inquiry/:id" element={<InquiryDetail />} />
              <Route path="inquirypage" element={<InquiryPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </RecoilRoot>
=======
              <Route path="/com" element={<COMLayout />}>
                <Route path="my-trip-list" element={<MyTripListPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route
                  path="destination-list"
                  element={<DestinationListPage />}
                />
                <Route path="my-scrap-list" element={<MyScrapListPage />} />
                <Route path=":tripId">
                  <Route path="itinerary" element={<Itinerary />} />
                  <Route path="details" element={<Details />} />
                </Route>
              </Route>
              <Route path="/support" element={<SupportLayout />}>
                <Route index element={<Notice />} />
                <Route path="notice" element={<Notice />} />
                <Route path="notice/:id" element={<NoticeDetail />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="inquiry" element={<Inquiry />} />
                <Route path="inquiry/:inquiryId" element={<InquiryDetail />} />
                <Route path="inquirypage" element={<InquiryPage />} />
              </Route>
            </Routes>
          </main>
        </div>
      </RecoilRoot>
    </React.StrictMode>
>>>>>>> 54af3b7325a8e17e35936cc090d850eb936f1940
  );
}

function InitializeUserWrapper() {
  useInitializeUser();
  return null;
}

export default App;
