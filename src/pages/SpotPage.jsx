import Searchbar from '../components/ui/Searchbar';
import Card from '../components/ui/Card';

export default function SpotPage() {
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
