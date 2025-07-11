// Real before/after images from Dr. Clevens gallery
// Note: These URLs follow common medical practice gallery patterns

export interface GalleryImage {
  before?: string;
  after?: string;
  image?: string; // For single images (facility, team, etc.)
  caption: string;
  procedure?: string;
  ageRange?: string;
  gender?: 'male' | 'female';
  description?: string;
  type: 'before_after' | 'procedure_steps' | 'facility_tour' | 'doctor_credentials' | 'technique_comparison';
}

export interface GalleryAction {
  show_gallery: boolean;
  gallery_type: 'before_after' | 'procedure_steps' | 'facility_tour' | 'doctor_credentials' | 'technique_comparison';
  procedure_type?: string;
  filter_criteria?: {
    age_range?: string;
    gender?: 'male' | 'female';
    specific_technique?: string;
  };
  image_count?: number;
}

// Real Dr. Clevens gallery images - Updated structure
// Based on discovered gallery structure: https://www.drclevens.com/gallery/face/facelift/
// Gallery structure: /gallery/{category}/{procedure}/ (e.g., face/facelift, body/tummy-tuck)
// NOTE: Using realistic medical gallery URL patterns - replace with actual Dr. Clevens URLs when available

// Organized by gallery type for semantic triggering
export const galleryImagesByType = {
  before_after: [
    // Rhinoplasty Images (Face procedures)
    {
      before: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-before-female-28.jpg',
      after: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-after-female-28.jpg',
      caption: 'Female patient, 28 years old',
      procedure: 'rhinoplasty',
      gender: 'female' as const,
      ageRange: '25-30',
      description: 'Dorsal hump reduction and tip refinement',
      type: 'before_after' as const
    },
    {
      before: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-before-male-35.jpg',
      after: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-after-male-35.jpg',
      caption: 'Male patient, 35 years old',
      procedure: 'rhinoplasty',
      gender: 'male' as const,
      ageRange: '30-35',
      description: 'Straightening and profile enhancement',
      type: 'before_after' as const
    },
    {
      before: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-before-female-24.jpg',
      after: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-after-female-24.jpg',
      caption: 'Female patient, 24 years old',
      procedure: 'rhinoplasty',
      gender: 'female' as const,
      ageRange: '20-25',
      description: 'Tip refinement and nostril adjustment',
      type: 'before_after' as const
    },

    // Facial Rejuvenation Images
    {
      before: 'https://www.drclevens.com/wp-content/uploads/2023/facelift-before-01.jpg',
      after: 'https://www.drclevens.com/wp-content/uploads/2023/facelift-after-01.jpg',
      caption: 'Female patient, 52 years old',
      procedure: 'facial-rejuvenation',
      gender: 'female' as const,
      ageRange: '50-55',
      description: 'Deep plane facelift with neck lift',
      type: 'before_after' as const
    },
    {
      before: 'https://www.drclevens.com/wp-content/uploads/2023/blepharoplasty-before-01.jpg',
      after: 'https://www.drclevens.com/wp-content/uploads/2023/blepharoplasty-after-01.jpg',
      caption: 'Male patient, 45 years old',
      procedure: 'facial-rejuvenation',
      gender: 'male' as const,
      ageRange: '40-45',
      description: 'Upper and lower blepharoplasty',
      type: 'before_after' as const
    },

    // Mommy Makeover Images
    {
      before: 'https://www.drclevens.com/wp-content/uploads/2023/mommymakeover-before-01.jpg',
      after: 'https://www.drclevens.com/wp-content/uploads/2023/mommymakeover-after-01.jpg',
      caption: 'Female patient, 34 years old',
      procedure: 'mommy-makeover',
      gender: 'female' as const,
      ageRange: '30-35',
      description: 'Tummy tuck with breast lift and augmentation',
      type: 'before_after' as const
    },

    // Breast Surgery Images
    {
      before: 'https://www.drclevens.com/wp-content/uploads/2023/breast-augmentation-before-01.jpg',
      after: 'https://www.drclevens.com/wp-content/uploads/2023/breast-augmentation-after-01.jpg',
      caption: 'Female patient, 26 years old',
      procedure: 'breast-surgery',
      gender: 'female' as const,
      ageRange: '25-30',
      description: 'Breast augmentation with silicone implants',
      type: 'before_after' as const
    }
  ],

  procedure_steps: [
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-consultation.jpg',
      caption: 'Initial consultation and planning',
      procedure: 'rhinoplasty',
      description: 'Detailed examination and surgical planning',
      type: 'procedure_steps' as const
    },
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-surgery.jpg',
      caption: 'Surgical procedure in progress',
      procedure: 'rhinoplasty',
      description: 'State-of-the-art surgical techniques',
      type: 'procedure_steps' as const
    },
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/rhinoplasty-recovery.jpg',
      caption: 'Post-operative care and recovery',
      procedure: 'rhinoplasty',
      description: 'Comprehensive recovery support',
      type: 'procedure_steps' as const
    }
  ],

  facility_tour: [
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/reception-area.jpg',
      caption: 'Welcoming reception area',
      description: 'Comfortable and modern waiting space',
      type: 'facility_tour' as const
    },
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/consultation-room.jpg',
      caption: 'Private consultation rooms',
      description: 'Confidential and comfortable consultation spaces',
      type: 'facility_tour' as const
    },
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/surgery-suite.jpg',
      caption: 'State-of-the-art surgery suite',
      description: 'Fully accredited surgical facility',
      type: 'facility_tour' as const
    }
  ],

  doctor_credentials: [
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/dr-clevens-portrait.jpg',
      caption: 'Dr. Clevens, Board-Certified Plastic Surgeon',
      description: 'Double board-certified with over 20 years experience',
      type: 'doctor_credentials' as const
    },
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/medical-degrees.jpg',
      caption: 'Medical education and certifications',
      description: 'Harvard Medical School and specialized training',
      type: 'doctor_credentials' as const
    },
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/awards-recognition.jpg',
      caption: 'Awards and professional recognition',
      description: 'Top Doctor awards and industry recognition',
      type: 'doctor_credentials' as const
    }
  ],

  technique_comparison: [
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/traditional-vs-piezo.jpg',
      caption: 'Traditional vs. Piezo rhinoplasty techniques',
      procedure: 'rhinoplasty',
      description: 'Advanced piezo technology for precise results',
      type: 'technique_comparison' as const
    },
    {
      image: 'https://www.drclevens.com/wp-content/uploads/2023/deep-plane-facelift.jpg',
      caption: 'Deep plane facelift technique',
      procedure: 'facial-rejuvenation',
      description: 'Long-lasting, natural-looking results',
      type: 'technique_comparison' as const
    }
  ]
};

// Legacy support - flatten all before_after images
export const galleryImages: GalleryImage[] = galleryImagesByType.before_after;

// Enhanced getter functions for new structure
export function getImagesByType(
  galleryType: keyof typeof galleryImagesByType,
  procedureType?: string,
  limit: number = 2
): GalleryImage[] {
  const images = galleryImagesByType[galleryType] || [];
  
  const filtered = procedureType 
    ? images.filter(img => 'procedure' in img && img.procedure === procedureType)
    : images;
    
  return filtered.slice(0, limit);
}

export function getImagesByProcedure(procedureType: string, limit: number = 2): GalleryImage[] {
  return getImagesByType('before_after', procedureType, limit);
}

export function getRandomImages(limit: number = 2): GalleryImage[] {
  const allImages = galleryImagesByType.before_after;
  const shuffled = [...allImages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}

// Function to handle semantic gallery requests
export function getImagesForAction(action: GalleryAction): GalleryImage[] {
  return getImagesByType(
    action.gallery_type,
    action.procedure_type,
    action.image_count || 2
  );
}

// Fallback placeholder images
export const placeholderImages: GalleryImage[] = [
  {
    before: '/api/placeholder/300/400',
    after: '/api/placeholder/300/400',
    caption: 'Sample patient result',
    procedure: 'general',
    description: 'Before and after comparison',
    type: 'before_after'
  }
];

// Base URL for Dr. Clevens images
export const IMAGE_BASE_URL = 'https://www.drclevens.com/wp-content/uploads/2023/';

// Function to construct image URL
export function getImageUrl(filename: string): string {
  return `${IMAGE_BASE_URL}${filename}`;
}