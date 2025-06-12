# POAP Integration Guide for Dream Layer

## Overview

I've successfully integrated the **Proof of Attendance Protocol (POAP)** into your Dream Layer app. This integration allows attendees to claim unique NFTs that prove their attendance at events, creating lasting digital memories and building community engagement.

## What is POAP?

POAP (Proof of Attendance Protocol) is a protocol that creates NFT badges to commemorate attendance at events. Each POAP is:
- A unique, non-transferable NFT
- Commemorative of a specific event
- Collected in attendees' wallets
- A way to build community and show participation history

## Architecture Overview

### 1. POAP Service (`src/services/poapService.ts`)

The core service that handles all POAP operations:

```typescript
- createPOAPEvent()     // Create new POAP events
- getPOAPEvent()        // Fetch event details
- claimPOAPWithCode()   // Claim POAP with secret code
- getUserPOAPs()        // Get user's POAP collection
- verifyLocationForClaim() // Location-based claiming
```

### 2. React Hook (`usePOAP`)

Convenient hook for React components:
```typescript
const { claimPOAP, getUserPOAPs, checkPOAPClaimed } = usePOAP();
```

### 3. Event Integration

Events page now includes:
- POAP availability indicators
- Check-in requirements before claiming
- Modal for entering secret codes
- Real-time claim status updates

## How It Works

### Event Flow:
1. **Event Creation**: Organizers create POAP events with unique secret codes
2. **Check-in**: Attendees check into events (QR scan or location)
3. **POAP Claiming**: After check-in, attendees can claim POAPs using secret codes
4. **NFT Minting**: POAPs are minted to attendees' wallets
5. **Collection**: Users can view their POAP collection in their profiles

### Technical Flow:
```
User Action → React Component → POAP Service → POAP API → Blockchain → User Wallet
```

## Setup for Production

### 1. Get POAP API Credentials

1. Visit [POAP Developer Portal](https://poap.tech/developers)
2. Apply for API access
3. Obtain your API key
4. Add to environment variables:

```bash
# .env.local
NEXT_PUBLIC_POAP_API_KEY=your_api_key_here
```

### 2. Configure POAP Service

Update the POAP service configuration:

```typescript
// In poapService.ts
private readonly API_KEY = process.env.NEXT_PUBLIC_POAP_API_KEY;
```

### 3. Event Creation Process

For each real event, you'll need to:

1. **Create POAP Event** via POAP dashboard or API:
```typescript
const eventData = {
  name: "Your Event Name",
  description: "Event description",
  start_date: "2025-06-15T18:00:00Z",
  end_date: "2025-06-15T22:00:00Z",
  image_url: "https://your-event-image.png",
  country: "US",
  city: "San Francisco"
};

const poapEvent = await poapService.createPOAPEvent(eventData);
```

2. **Generate Secret Codes** for claiming
3. **Update your app** with event details and codes

## Features Implemented

### ✅ Core POAP Features
- Event check-in system
- Secret code claiming
- Wallet integration
- Real-time status updates
- Location verification (optional)
- User POAP collection tracking

### ✅ UI/UX Features
- Elegant POAP claim modal
- Progress indicators
- Success/error feedback
- Mobile-responsive design
- Loading states and animations

### ✅ Security Features
- Wallet connection verification
- Secret code validation
- Location-based verification (optional)
- Duplicate claim prevention

## Usage Examples

### Basic POAP Claiming:
```typescript
// In your component
const { claimPOAP } = usePOAP();

const handleClaim = async () => {
  const result = await claimPOAP(eventId, secretCode);
  if (result.success) {
    console.log('POAP claimed!', result.tx_hash);
  }
};
```

### Check User's POAPs:
```typescript
const { getUserPOAPs } = usePOAP();

const userPOAPs = await getUserPOAPs();
console.log('User has', userPOAPs.length, 'POAPs');
```

### Event Setup:
```typescript
// Create event with POAP data
const event = {
  id: '1',
  title: 'Web3 Community Meetup #12',
  secretCode: 'DREAMLAYER2025', // Secret for claiming
  poapImageUrl: 'https://assets.poap.xyz/event-image.png'
};
```

## Advanced Features

### 1. QR Code Integration
For production, integrate with camera for QR scanning:
```typescript
// Install: npm install qr-scanner
import QrScanner from 'qr-scanner';

const scanner = new QrScanner(videoElement, result => {
  handleSecretCode(result);
});
```

### 2. Location Verification
Enable location-based claiming:
```typescript
const isValidLocation = await poapService.verifyLocationForClaim(
  eventId,
  userLocation,
  eventLocation,
  1000 // 1km radius
);
```

### 3. Batch Operations
Handle multiple events efficiently:
```typescript
// Check POAP status for all events
const events = await Promise.all(
  eventIds.map(id => poapService.getPOAPEvent(id))
);
```

## Testing the Integration

### Current Demo Features:
1. **Mock Events**: Three sample events with secret codes
2. **Simulated Claiming**: Demo POAP claiming without real blockchain interaction
3. **Secret Codes**:
   - Web3 Meetup: `DREAMLAYER2025`
   - Solana Workshop: `SOLANA2025`
   - IP Summit: `IPSUMMIT2025`

### Testing Flow:
1. Navigate to Events page
2. Click "Check In" on any event
3. Use location or QR simulation
4. Click "Claim POAP" after check-in
5. Enter the secret code
6. See success message and updated status

## Production Deployment

### Environment Setup:
```bash
# Required environment variables
NEXT_PUBLIC_POAP_API_KEY=your_poap_api_key
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### Additional Dependencies:
```bash
npm install qr-scanner          # For QR code scanning
npm install react-qr-code      # For generating QR codes
npm install @geolocation-api    # For location services
```

### Database Integration:
Consider adding a database to track:
- Event check-ins
- POAP claim history
- User attendance records
- Event analytics

## Next Steps

### 1. Real POAP API Integration
- Apply for POAP API access
- Replace mock data with real API calls
- Test with actual POAP events

### 2. Enhanced Features
- **QR Code Generation**: Create claim QR codes for events
- **Analytics Dashboard**: Track attendance and claims
- **Social Sharing**: Let users share their POAPs
- **Collection Display**: Show user POAP galleries

### 3. Mobile App Integration
- **Camera Integration**: Real QR code scanning
- **Push Notifications**: Event reminders and claim alerts
- **Offline Support**: Cache events for offline access

### 4. Community Features
- **POAP Leaderboards**: Show most active community members
- **Achievement System**: Unlock features based on POAP collection
- **Community Challenges**: Group goals for POAP collection

## Support & Resources

- **POAP Documentation**: https://documentation.poap.tech/
- **POAP Discord**: https://discord.gg/poap
- **API Reference**: https://documentation.poap.tech/reference
- **Best Practices**: https://poap.tech/best-practices

## Integration Benefits

✅ **Community Building**: Create lasting memories of events
✅ **Engagement Tracking**: Monitor community participation
✅ **Gamification**: Encourage attendance with collectibles
✅ **Proof of Participation**: Verifiable attendance records
✅ **Network Effects**: Users share and showcase POAPs
✅ **Data Insights**: Analytics on community engagement

The POAP integration transforms your events from simple gatherings into memorable, verifiable experiences that build lasting community connections. Your attendees now have a reason to not just attend, but to actively engage and collect proof of their journey with Dream Layer!
