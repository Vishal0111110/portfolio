import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Resend } from 'resend';

// Types
interface VisitorData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  continent?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  user_agent: string;
  referrer?: string;
  timestamp: Date;
  path?: string;
}

interface IPGeolocationData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  country_code?: string;
  continent?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

// Environment variables
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const YOUR_EMAIL = process.env.YOUR_EMAIL || 'your-email@example.com';

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
async function getIPGeolocation(ip: string): Promise<IPGeolocationData> {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      throw new Error('Failed to fetch geolocation data');
    }
    const data = await response.json();
    return {
      ip: data.ip || ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      country_code: data.country_code,
      continent: data.continent_code,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    };
  } catch (error) {
    console.error('Error fetching IP geolocation:', error);
    return { ip };
  }
}

// Send email notification
async function sendVisitorEmail(visitorData: VisitorData) {
  if (!RESEND_API_KEY || !YOUR_EMAIL) {
    console.log('Email notification skipped: Missing API credentials');
    return;
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    
    const location = visitorData.city 
      ? `${visitorData.city}, ${visitorData.region || ''}, ${visitorData.country || ''}`.replace(/,\s*,/g, ',').trim()
      : 'Unknown location';

    await resend.emails.send({
      from: 'Portfolio Visitor <noreply@yourdomain.com>',
      to: YOUR_EMAIL,
      subject: `🌐 New Visitor to Your Portfolio - ${visitorData.timestamp.toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #ff3b30; padding-bottom: 10px;">
            New Website Visitor
          </h2>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #666;">Visitor Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">IP Address:</td>
                <td style="padding: 8px; color: #666;">${visitorData.ip}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Location:</td>
                <td style="padding: 8px; color: #666;">${location}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Country:</td>
                <td style="padding: 8px; color: #666;">${visitorData.country || 'Unknown'} (${visitorData.country_code || 'N/A'})</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Coordinates:</td>
                <td style="padding: 8px; color: #666;">${visitorData.latitude && visitorData.longitude ? `${visitorData.latitude}, ${visitorData.longitude}` : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Timezone:</td>
                <td style="padding: 8px; color: #666;">${visitorData.timezone || 'Unknown'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Timestamp:</td>
                <td style="padding: 8px; color: #666;">${visitorData.timestamp.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Page:</td>
                <td style="padding: 8px; color: #666;">${visitorData.path || '/'}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; color: #333;">Referrer:</td>
                <td style="padding: 8px; color: #666;">${visitorData.referrer || 'Direct visit'}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 12px; color: #666;">
            <strong>User Agent:</strong><br/>
            <code style="word-break: break-all;">${visitorData.user_agent}</code>
          </div>

          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            This is an automated notification from your portfolio website.
          </p>
        </div>
      `,
    });
    
    console.log('Visitor email sent successfully');
  } catch (error) {
    console.error('Error sending visitor email:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ip, user_agent, referrer, path } = body;

    if (!ip || !user_agent) {
      return NextResponse.json(
        { error: 'Missing required fields: ip and user_agent' },
        { status: 400 }
      );
    }

    // Get geolocation data
    const geoData = await getIPGeolocation(ip);

    // Create visitor data object
    const visitorData: VisitorData = {
      ip: geoData.ip,
      city: geoData.city,
      region: geoData.region,
      country: geoData.country,
      country_code: geoData.country_code,
      continent: geoData.continent,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      timezone: geoData.timezone,
      user_agent,
      referrer,
      timestamp: new Date(),
      path,
    };

    // Store in Firebase Firestore if configured
    const firebaseDB = getFirebaseDB();
    if (firebaseDB) {
      try {
        await firebaseDB.collection('visitors').add(visitorData);
        console.log('Visitor data stored in Firebase Firestore');
      } catch (dbError) {
        console.error('Error storing visitor data in Firebase:', dbError);
      }
    } else {
      console.log('Firebase not configured, skipping database storage');
    }

    // Send email notification
    await sendVisitorEmail(visitorData);

    return NextResponse.json({ 
      success: true, 
      message: 'Visitor tracked successfully',
      data: {
        ip: visitorData.ip,
        location: visitorData.city ? `${visitorData.city}, ${visitorData.country}` : 'Unknown',
        timestamp: visitorData.timestamp,
      }
    });

  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}
