import Searchbar from '../components/ui/Searchbar';
import Spot from '../components/spot/Spot';

export default function CurationPage() {
  return (
    <div className="w-full">
      <div className="w-1/2 h-15">
        <Searchbar />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Spot />
        <Spot />
        <Spot />
        <Spot />
        <Spot />
        <Spot />
        <Spot />
        <Spot />
      </div>
    </div>
  );
}
