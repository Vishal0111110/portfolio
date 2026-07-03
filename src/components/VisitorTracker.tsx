'use client';

import { useEffect } from 'react';

interface VisitorTrackerProps {
  enabled?: boolean;
}

export default function VisitorTracker({ enabled = true }: VisitorTrackerProps) {
  useEffect(() => {
    if (!enabled) return;

    const trackVisitor = async () => {
      try {
        // Get client IP using a free IP service
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        // Get user agent and referrer
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || undefined;
        const path = window.location.pathname;

        // Send visitor data to our API
        const response = await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ip,
            user_agent: userAgent,
            referrer,
            path,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API request failed:', response.status, errorText);
          throw new Error(`API returned ${response.status}: ${errorText}`);
        }

        console.log('Visitor tracked successfully');
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    // Track visitor on page load
    trackVisitor();
  }, [enabled]);

  return null; // This component doesn't render anything
}
