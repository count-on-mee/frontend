import Searchbar from '../components/ui/Searchbar';
import Card from '../components/ui/Card';
import { useRecoilValue } from 'recoil';
import authAtom from '../recoil/auth';

export default function SpotPage() {
  const auth = useRecoilValue(authAtom);
  console.log('SpotPage accessToken:', auth.accessToken); 
  return (
    <div className="w-full">
      <div className="w-1/4">
        <Searchbar />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
