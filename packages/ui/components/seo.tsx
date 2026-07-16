import { useEffect, useState } from 'react';

interface SEOProps {
  title?: string | null | undefined;
  description?: string | null | undefined;
  appId?: string;
}

export function SEO({ title, description, appId }: SEOProps) {
  const [globalSettings, setGlobalSettings] = useState<any>(null);

  useEffect(() => {
    // Fetch global settings directly without SWR to avoid extra dependencies in UI library
    const apiUrl = (import.meta as any).env?.VITE_API_URL || '';
    if (!apiUrl) return;

    fetch(`${apiUrl}/v1/settings?app=${appId || 'storefront'}`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((json) => {
        if (json.data) setGlobalSettings(json.data);
      })
      .catch(() => {
        // Silently ignore error on client
      });
  }, []);

  useEffect(() => {
    const siteTitle = globalSettings?.siteTitle || 'StarSuperScare Marketplace';

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
