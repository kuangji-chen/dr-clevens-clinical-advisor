# Semantic Gallery System Documentation

## Overview

The Dr. Clevens Chatbot now features an advanced semantic gallery system that automatically displays relevant images based on natural language understanding through Claude AI. This system supports multiple types of visual content and provides intelligent context-aware image galleries.

## Features

### 🎯 Semantic Understanding
- **Natural Language Processing**: Claude AI analyzes user intent and automatically triggers appropriate galleries
- **No Keyword Matching**: Advanced semantic understanding replaces rigid keyword-based triggers
- **Context Awareness**: Gallery selection based on conversation context and detected procedure types

### 🖼️ Multiple Gallery Types

1. **Before/After Results** (`before_after`)
   - Traditional side-by-side before/after comparisons
   - Procedure-specific filtering (rhinoplasty, facial rejuvenation, etc.)
   - Patient demographic filtering (age, gender)

2. **Procedure Steps** (`procedure_steps`) 
   - Educational images showing surgical process
   - Consultation, surgery, and recovery phases
   - Technique demonstration images

3. **Facility Tour** (`facility_tour`)
   - Reception area and consultation rooms
   - State-of-the-art surgical suites
   - Modern medical equipment

4. **Doctor Credentials** (`doctor_credentials`)
   - Dr. Clevens professional portraits
   - Medical degrees and certifications
   - Awards and professional recognition

5. **Technique Comparison** (`technique_comparison`)
   - Traditional vs. advanced surgical techniques
   - Piezo rhinoplasty technology
   - Deep plane facelift methods

## How It Works

### User Interaction Examples

| User Input | Triggered Gallery | Type |
|------------|------------------|------|
| "Show me before and after photos" | Before/after results | `before_after` |
| "Can I see examples?" | Before/after results | `before_after` |
| "What does the procedure look like?" | Procedure steps | `procedure_steps` |
| "Show me your facility" | Facility tour | `facility_tour` |
| "What are Dr. Clevens credentials?" | Doctor credentials | `doctor_credentials` |
| "How does this technique work?" | Technique comparison | `technique_comparison` |

### Technical Flow

1. **User sends message** → Claude API analyzes intent
2. **Claude returns structured response** with JSON action block:
   ```json
   {
     "action": {
       "show_gallery": true,
       "gallery_type": "before_after",
       "procedure_type": "rhinoplasty",
       "image_count": 2
     }
   }
   ```
3. **System parses action** → Fetches appropriate images
4. **Gallery displays** → Formatted for optimal viewing

## Implementation Details

### Data Structure

```typescript
interface GalleryImage {
  before?: string;           // Before image URL
  after?: string;            // After image URL  
  image?: string;            // Single image URL (for non-comparison types)
  caption: string;           // Display caption
  procedure?: string;        // Associated procedure
  ageRange?: string;         // Patient age range
  gender?: 'male' | 'female'; // Patient gender
  description?: string;      // Detailed description
  type: 'before_after' | 'procedure_steps' | 'facility_tour' | 'doctor_credentials' | 'technique_comparison';
}
```

### Gallery Organization

Images are organized by type in `galleryImagesByType`:

```typescript
export const galleryImagesByType = {
  before_after: [...],        // Patient results
  procedure_steps: [...],     // Educational content
  facility_tour: [...],       // Office/equipment photos
  doctor_credentials: [...],  // Professional credentials
  technique_comparison: [...] // Surgical techniques
};
```

### Smart Image Display

- **Before/After**: Side-by-side comparison with labeled overlays
- **Single Images**: Full-width display for facility, credentials, etc.
- **Responsive Design**: Adapts to desktop and mobile screens
- **Fallback System**: Automatic placeholder images if URLs fail

## File Structure

```
data/
├── galleryImages.ts          # Gallery data and helper functions

app/api/
├── chat/route.ts            # Claude API integration with JSON parsing
├── placeholder/[...dimensions]/route.ts # Fallback placeholder generator

components/
├── ConversationalAdvisor.tsx # Main chat interface
├── MessageComponent.tsx     # Message rendering with gallery support
└── CallModal.tsx           # Voice call modal

store/
├── conversationStore.ts     # State management with gallery actions

utils/
├── claudeService.ts         # Claude API service layer
└── sessionStorage.ts       # Session persistence

types/
└── conversation.ts          # TypeScript interfaces
```

## Configuration

### Next.js Image Optimization

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    domains: ['www.drclevens.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.drclevens.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};
```

### Claude API Prompting

The system uses structured prompting to ensure Claude returns proper JSON actions:

```
GALLERY ACTIONS:
When the user requests to see images, results, photos, examples, or facility tours, include a JSON action block in your response:

For before/after photos: {"action":{"show_gallery":true,"gallery_type":"before_after","procedure_type":"rhinoplasty","image_count":2}}
```

## Error Handling

### Graceful Fallbacks
- **Missing Images**: Automatic fallback to placeholder images
- **API Failures**: Error messages with retry options
- **Invalid JSON**: Logs errors and continues without gallery
- **Type Mismatches**: Default to general before/after gallery

### Image Loading
```typescript
onError={(e) => {
  e.currentTarget.src = '/api/placeholder/300/400';
}}
```

## Performance Optimizations

### Lazy Loading
- Images load only when gallery is triggered
- Placeholder generation on-demand
- Efficient caching with Next.js Image component

### API Efficiency
- Streaming responses for real-time chat
- Minimal payload with structured JSON
- Session-based state management

## Future Enhancements

### Planned Features
1. **Advanced Filtering**: Age range, specific techniques, case complexity
2. **Image Optimization**: WebP conversion, responsive images
3. **Real Dr. Clevens Images**: Integration with actual gallery API
4. **Video Support**: Before/after video comparisons
5. **3D Visualization**: Interactive procedure simulations

### Extension Points
```typescript
// Easy to add new gallery types
export type GalleryType = 
  | 'before_after'
  | 'procedure_steps' 
  | 'facility_tour'
  | 'doctor_credentials'
  | 'technique_comparison'
  | 'patient_testimonials'    // Future
  | 'recovery_timeline'       // Future
  | 'virtual_consultations';  // Future
```

## Testing

### Manual Testing
1. Start conversation about specific procedures
2. Ask to see images using natural language
3. Verify correct gallery type displays
4. Test fallback behavior with invalid URLs

### Example Test Cases
```
✅ "Show me rhinoplasty results" → before_after with rhinoplasty filter
✅ "Can I see your office?" → facility_tour gallery
✅ "What are your credentials?" → doctor_credentials gallery  
✅ "How does the surgery work?" → procedure_steps gallery
```

## API Integration

### Real Image URLs
When actual Dr. Clevens gallery becomes available, update image URLs in:
```typescript
// Replace placeholder URLs with real gallery images
const realImageMappings = {
  rhinoplasty: ['actual-image-1.jpg', 'actual-image-2.jpg'],
  // ... other procedures
};
```

## Conclusion

This semantic gallery system provides a flexible, intelligent way to display medical imagery based on natural conversation. The modular design allows for easy extension and the semantic understanding ensures users see relevant content without needing to know specific commands.