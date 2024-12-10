const FALLBACK_IMAGES = [
  '/fallback-1.jpg',
  '/fallback-2.jpg',
  '/fallback-3.jpg'
];

export const getPhotoUrl = async (placeId) => {
    if (!placeId) return getRandomFallbackImage();
    
    const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
    if (!apiKey) {
        console.warn('Google Places API key is missing');
        return getRandomFallbackImage();
    }

    try {
        const response = await fetch(
            `${GOOGLE_PHOTOS_API_BASE}/${placeId}/photos`,
            {
                method: 'GET',
                headers: {
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': 'photos.name',
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.photos || data.photos.length === 0) {
            return getRandomFallbackImage();
        }

        const photoUrl = `${GOOGLE_PHOTOS_API_BASE}/${data.photos[0].name}/media`;
        // Verify if the photo URL is accessible
        const photoResponse = await fetch(photoUrl);
        if (!photoResponse.ok) {
            return getRandomFallbackImage();
        }

        return photoUrl;
    } catch (error) {
        console.error('Photo fetch error:', error);
        return getRandomFallbackImage();
    }
};

export const getRandomFallbackImage = () => {
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
};