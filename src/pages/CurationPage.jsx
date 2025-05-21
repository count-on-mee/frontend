import Searchbar from '../components/ui/Searchbar';
import Card from '../components/ui/Card';

export default function CurationPage() {
  return (
    <div className="w-full">
      <div className="w-1/2 mb-4 mt-6 ml-5">
        <Searchbar size="lg" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
}
