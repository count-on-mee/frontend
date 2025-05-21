import Searchbar from '../components/ui/Searchbar';
import Card from '../components/ui/Card';

export default function SpotPage() {
  return (
    <div className="w-full">
      <div className="w-1/4">
        <div className="mt-6 mb-4 ml-5">
          <Searchbar size="lg" />
        </div>
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
