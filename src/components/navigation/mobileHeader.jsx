import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../../recoil/user';
import logoImage from '../../assets/logo.png';

export default function MobileHeader() {
  const user = useRecoilValue(userAtom);

  return (
    <header className="desktop:hidden sticky top-0 z-40 h-14 w-full flex items-center justify-between px-4 bg-background-gray header-border shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <Link to="/">
        <img src={logoImage} alt="logo" className="h-9 w-auto rounded-lg" />
      </Link>

      {user ? (
        <Link to="/me">
          <img
            src={user.imgUrl}
            alt="profile"
            className="w-8 h-8 rounded-full object-cover box-shadow"
          />
        </Link>
      ) : (
        <Link to="/login" className="text-charcoal font-light hover:font-normal transition-all">
          Log in
        </Link>
      )}
    </header>
  );
}
