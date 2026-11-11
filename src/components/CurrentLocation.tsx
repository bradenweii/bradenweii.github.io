import React, { useEffect, useState } from 'react';

const automaticLocationUrl =
  'https://raw.githubusercontent.com/bradenweii/bradenweii.github.io/location-data/location.json';

async function readCity(url: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, { cache: 'no-cache', signal });
  if (!response.ok) return '';
  const location = await response.json();
  return typeof location?.city === 'string' ? location.city.trim() : '';
}

export function CurrentLocation() {
  const [city, setCity] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const updateCity = async () => {
      const manualUrl = `${process.env.PUBLIC_URL ?? ''}/location.json`;
      const automatic = await readCity(automaticLocationUrl, signal).catch(() => '');
      if (signal.aborted) return;
      const city = automatic || await readCity(manualUrl, signal).catch(() => '');
      if (!signal.aborted) setCity(city);
    };
    void updateCity();

    return () => controller.abort();
  }, []);

  if (!city) return null;

  return (
    <p className="mb-6 flex items-center gap-2.5 text-sm text-[#aab4bf]">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#a5d9c5]" />
      <span>Currently in <span className="text-[#e5ebf0]">{city}</span></span>
    </p>
  );
}
