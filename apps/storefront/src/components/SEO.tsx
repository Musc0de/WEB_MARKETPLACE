import { useEffect } from 'react';
import useSWR from 'swr';
import { client } from '../lib/api.ts';

interface SEOProps {
  title?: string | null | undefined;
  description?: string | null | undefined;
}

export function SEO({ title, description }: SEOProps) {
  const { data: globalSettings } = useSWR('/api/v1/settings', async () => {
    try {
      // Assuming a public endpoint is available at /api/v1/settings
      const res = await (client.v1 as any).settings.$get();
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch {
      return null;
    }
  }, { revalidateOnFocus: false });

  useEffect(() => {
    // 1. Update Title
    const siteTitle = globalSettings?.siteTitle || '';
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    document.title = finalTitle;

    // 2. Update Description
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

    // 3. Update Favicon
    if (globalSettings?.faviconUrl) {
      let linkIcon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (!linkIcon) {
        linkIcon = document.createElement('link');
        linkIcon.setAttribute('rel', 'icon');
        document.head.appendChild(linkIcon);
      }
      linkIcon.href = globalSettings.faviconUrl;
    }
  }, [title, description, globalSettings]);

  return null;
}
