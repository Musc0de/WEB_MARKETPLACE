import { useEffect, useState } from 'react';

interface SEOProps {
  title?: string | null | undefined;
  description?: string | null | undefined;
  appId?: string;
}

let globalSettingsCache: Promise<any> | null = null;

export function SEO({ title, description, appId }: SEOProps) {
  const [globalSettings, setGlobalSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch global settings manually but deduplicate using a module-level cache
    const apiUrl = (import.meta as any).env?.VITE_API_URL || '';
    if (!apiUrl) return;

    if (!globalSettingsCache) {
      globalSettingsCache = fetch(`${apiUrl}/v1/settings?app=${appId || ''}`)
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        });
    }

    globalSettingsCache
      .then((json) => {
        if (json.data) setGlobalSettings(json.data);
      })
      .catch(() => {
        globalSettingsCache = null; // Clear cache on failure so it can retry
      });
  }, []);

  useEffect(() => {
    const siteTitle = globalSettings?.siteTitle || '';

    let finalTitle = siteTitle;
    if (title) {
      finalTitle = `${title} | ${siteTitle}`;
    }

    if (finalTitle) {
      document.title = finalTitle;
    }

    const finalDesc = description || globalSettings?.siteDescription;
    if (finalDesc) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', finalDesc);
    }

    if (globalSettings?.faviconUrl) {
      let linkIcon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.setAttribute('rel', 'icon');
        document.head.appendChild(linkIcon);
      }
      linkIcon.href = globalSettings.faviconUrl;
    }
  }, [title, description, appId, globalSettings]);

  return null;
}
