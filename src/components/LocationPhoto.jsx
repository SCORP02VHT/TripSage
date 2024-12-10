
import { useState, useEffect } from 'react';
import { getPhotoUrl } from '@/utils/photoHelpers';
import { cn } from '@/lib/utils';

export function LocationPhoto({ placeId, className }) {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const loadPhoto = async () => {
            try {
                setLoading(true);
                const url = await getPhotoUrl(placeId);
                setPhotoUrl(url);
            } catch (error) {
                if (retryCount < 3) {
                    setRetryCount(prev => prev + 1);
                }
            } finally {
                setLoading(false);
            }
        };

        loadPhoto();
    }, [placeId, retryCount]);

    if (loading) {
        return (
            <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)}>
                <div className="w-full h-full bg-gray-300" />
            </div>
        );
    }

    return (
        <img 
            src={photoUrl}
            alt="Location"
            className={cn("object-cover rounded-lg", className)}
            onError={() => {
                if (retryCount < 3) {
                    setRetryCount(prev => prev + 1);
                }
            }}
        />
    );
}
