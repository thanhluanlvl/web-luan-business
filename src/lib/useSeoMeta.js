import { useEffect } from 'react';

const META_TARGETS = [
  ['meta[name="description"]', 'content', 'description'],
  ['link[rel="canonical"]', 'href', 'url'],
  ['meta[property="og:title"]', 'content', 'title'],
  ['meta[property="og:description"]', 'content', 'description'],
  ['meta[property="og:url"]', 'content', 'url'],
  ['meta[property="og:image"]', 'content', 'image'],
  ['meta[name="twitter:title"]', 'content', 'title'],
  ['meta[name="twitter:description"]', 'content', 'description'],
  ['meta[name="twitter:image"]', 'content', 'image'],
];

export default function useSeoMeta({ title, description, url, image }) {
  useEffect(() => {
    const previousTitle = document.title;
    const previousValues = META_TARGETS.map(([selector, attribute]) => {
      const element = document.querySelector(selector);
      return [element, attribute, element?.getAttribute(attribute)];
    });

    document.title = title;
    META_TARGETS.forEach(([selector, attribute, key]) => {
      const value = { title, description, url, image }[key];
      if (value) document.querySelector(selector)?.setAttribute(attribute, value);
    });

    return () => {
      document.title = previousTitle;
      previousValues.forEach(([element, attribute, value]) => {
        if (element && value !== null && value !== undefined) element.setAttribute(attribute, value);
      });
    };
  }, [description, image, title, url]);
}
