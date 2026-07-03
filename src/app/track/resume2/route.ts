import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// Environment variables
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const YOUR_EMAIL = process.env.YOUR_EMAIL || 'buyyarapuvishalgaurav616@gmail.com';

// Firebase Admin initialization
let db: any = null;

function getFirebaseDB() {
  if (!db && FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY,
        }),
      });
    }
    db = getFirestore();
  }
  return db;
}

// Fetch IP geolocation data
async function getIPGeolocation(ip: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data');
    }
    const data = await response.json();
    return {
      ip: data.query || ip,
      city: data.city || null,
      region: data.regionName || null,
      country: data.country || null,
      country_code: data.countryCode || null,
      continent: null,
      latitude: data.lat || null,
      longitude: data.lon || null,
      timezone: data.timezone || null,
    };
  } catch (error) {
    console.error('Error fetching IP geolocation:', error);
    return { ip, city: null, region: null, country: null, country_code: null, continent: null, latitude: null, longitude: null, timezone: null };
  }
}

// Send email notification
async function sendLinkAccessEmail(linkData: any) {
  if (!RESEND_API_KEY || !YOUR_EMAIL) {
    console.log('Email notification skipped: Missing API credentials');
    return;
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    const location = linkData.city
      ? `${linkData.city}, ${linkData.region || ''}, ${linkData.country || ''}`.replace(/,\s*,/g, ',').trim()
      : 'Unknown location';

    await resend.emails.send({
      from: 'Portfolio Tracker <onboarding@resend.dev>',
      to: YOUR_EMAIL,
      subject: `📄 Resume 2 Accessed - ${linkData.timestamp.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            Resume 2 Accessed
          </h2>

          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #666;">Visitor Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">IP Address:</td>
                <td style="padding: 8px; color: #666;">${linkData.ip}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Location:</td>
                <td style="padding: 8px; color: #666;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Timestamp:</td>
                <td style="padding: 8px; color: #666;">${linkData.timestamp.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            This is an automated notification from your portfolio tracking system.
          </p>
        </div>
      `,
    });

    console.log('Resume 2 access email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Get user agent and referrer
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || null;

    // Get geolocation data
    const geoData = await getIPGeolocation(ip);

    // Create link access data
    const linkData = {
      ip: geoData.ip,
      city: geoData.city,
      region: geoData.region,
      country: geoData.country,
      country_code: geoData.country_code,
      continent: geoData.continent,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      timezone: geoData.timezone,
      user_agent: userAgent,
      referrer,
      timestamp: new Date(),
      link_type: 'resume2',
    };

    // Store in Firebase Firestore
    const firebaseDB = getFirebaseDB();
    if (firebaseDB) {
      try {
        await firebaseDB.collection('resume2_accesses').add(linkData);
        console.log('Resume 2 access stored in Firebase Firestore');
      } catch (dbError) {
        console.error('Error storing link access in Firebase:', dbError);
        console.error('Firebase config check:', {
          hasProjectId: !!FIREBASE_PROJECT_ID,
          hasClientEmail: !!FIREBASE_CLIENT_EMAIL,
          hasPrivateKey: !!FIREBASE_PRIVATE_KEY,
        });
      }
    } else {
      console.log('Firebase not configured for Resume 2 tracking, skipping database storage');
      console.error('Firebase config check:', {
        hasProjectId: !!FIREBASE_PROJECT_ID,
        hasClientEmail: !!FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!FIREBASE_PRIVATE_KEY,
      });
    }

    // Send email notification
    await sendLinkAccessEmail(linkData);

    // Redirect to resume 2
    const resumeUrl = 'https://drive.google.com/file/d/1WnHMCJzPO9LQo-F8aV386etvfln6RZ1V/view';
    return NextResponse.redirect(resumeUrl);

  } catch (error) {
    console.error('Error tracking resume 2 access:', error);
    // Still redirect even if tracking fails
    const resumeUrl = 'https://drive.google.com/file/d/1WnHMCJzPO9LQo-F8aV386etvfln6RZ1V/view';
    return NextResponse.redirect(resumeUrl);
  }
}
