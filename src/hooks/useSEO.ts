import { useEffect } from 'react';

export function useSEO(title: string, description: string) {
  useEffect(() => {
    // Save original title and description
    const originalTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const originalDescription = metaDescription ? metaDescription.getAttribute('content') : '';

    // Update title
    document.title = title;

    // Update description
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Cleanup when component unmounts
    return () => {
      document.title = originalTitle;
      const cleanupMetaDescription = document.querySelector('meta[name="description"]');
      if (cleanupMetaDescription && originalDescription) {
        cleanupMetaDescription.setAttribute('content', originalDescription);
      }
    };
  }, [title, description]);
}
