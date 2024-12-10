import ErrorBoundary from './ErrorBoundary';
import CachedImage from './CachedImage';

const YourPhotoComponent = ({ placeId }) => {
  return (
    <ErrorBoundary>
      <CachedImage
        src={getPhotoUrl(placeId)}
        alt="Location photo"
        className="w-full h-64 object-cover"
      />
    </ErrorBoundary>
  );
};

export default YourPhotoComponent;
