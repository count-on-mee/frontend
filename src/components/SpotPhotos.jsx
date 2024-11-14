export default function SpotPhotos({ spot }) {
  return (
    <img
      src={spot.image || '../src/assets/img/logo.png'}
      className="w-full h-48 opacity-70 object-scale-down"
      alt={spot.name || 'Spot image'}
    />
  );
}
