// Simplified gallery structure for Dr. Clevens clinical advisor

export interface GalleryImage {
  image: string; // Single image containing before/after or standalone
  caption: string;
  procedure?: string;
  description?: string;
  type: 'before_after' | 'procedure' | 'facility' | 'credentials';
  caseId?: string;
}

export interface GalleryAction {
  show_gallery: boolean;
  gallery_type: 'before_after' | 'procedure' | 'facility' | 'credentials';
  procedure_type?: string;
  image_count?: number;
}

// Simplified gallery categories based on Dr. Clevens website
export const galleryImagesByType = {
  before_after: [
    // Rhinoplasty
    {
      image: 'https://picsum.photos/800/400?random=1',
      caption: 'Rhinoplasty Result',
      procedure: 'rhinoplasty',
      description: 'Piezo rhinoplasty with dorsal hump reduction and tip refinement',
      type: 'before_after' as const,
      caseId: 'RH-001'
    },
    {
      image: 'https://picsum.photos/800/400?random=2',
      caption: 'Rhinoplasty Result',
      procedure: 'rhinoplasty',
      description: 'Structural rhinoplasty for improved breathing and aesthetics',
      type: 'before_after' as const,
      caseId: 'RH-002'
    },
    // Facial Rejuvenation
    {
      image: 'https://picsum.photos/800/400?random=3',
      caption: 'Facelift Result',
      procedure: 'facial-rejuvenation',
      description: 'Deep plane facelift with neck lift and fat grafting',
      type: 'before_after' as const,
      caseId: 'FL-001'
    },
    {
      image: 'https://picsum.photos/800/400?random=4',
      caption: 'Blepharoplasty Result',
      procedure: 'facial-rejuvenation',
      description: 'Upper and lower blepharoplasty with canthopexy',
      type: 'before_after' as const,
      caseId: 'BL-001'
    },
    // Body Contouring
    {
      image: 'https://picsum.photos/800/400?random=5',
      caption: 'Mommy Makeover Result',
      procedure: 'mommy-makeover',
      description: 'Full tummy tuck with muscle repair, breast lift and augmentation',
      type: 'before_after' as const,
      caseId: 'MM-001'
    },
    {
      image: 'https://picsum.photos/800/400?random=6',
      caption: 'Tummy Tuck Result',
      procedure: 'body-contouring',
      description: 'Extended tummy tuck with liposuction',
      type: 'before_after' as const,
      caseId: 'TT-001'
    },
    // Breast Surgery
    {
      image: 'https://picsum.photos/800/400?random=7',
      caption: 'Breast Augmentation Result',
      procedure: 'breast-surgery',
      description: 'Breast augmentation with cohesive gel implants',
      type: 'before_after' as const,
      caseId: 'BA-001'
    }
  ],

  procedure: [
    {
      image: 'https://picsum.photos/600/400?random=20',
      caption: 'Consultation and Planning',
      procedure: 'general',
      description: 'Comprehensive examination and surgical planning',
      type: 'procedure' as const,
      caseId: 'PS-001'
    },
    {
      image: 'https://picsum.photos/600/400?random=21',
      caption: 'Surgery Suite',
      procedure: 'general',
      description: 'State-of-the-art surgical facility',
      type: 'procedure' as const,
      caseId: 'PS-002'
    }
  ],

  facility: [
    {
      image: 'https://picsum.photos/800/600?random=30',
      caption: 'Reception Area',
      description: 'Welcoming and comfortable patient environment',
      type: 'facility' as const,
      caseId: 'FT-001'
    },
    {
      image: 'https://picsum.photos/800/600?random=31',
      caption: 'Consultation Rooms',
      description: 'Private consultation suites with advanced imaging',
      type: 'facility' as const,
      caseId: 'FT-002'
    }
  ],

  credentials: [
    {
      image: 'https://picsum.photos/400/500?random=40',
      caption: 'Dr. Ross Clevens, MD, FACS',
      description: 'Board-certified plastic surgeon with 25+ years experience',
      type: 'credentials' as const,
      caseId: 'DC-001'
    }
  ]
};

export const newGalleryImagesByType = {
  'Face': {
    'Facelift': [
      'https://www.datocms-assets.com/62461/1741990933-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Laser Assisted Weekend Neck Lift': [
      'https://www.datocms-assets.com/62461/1656129913-c029a924-9e47-4b90-8772-69be292f019b.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Profile Neck Lift': [
      'https://www.datocms-assets.com/62461/1740780874-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Express Lift': [
      'https://www.datocms-assets.com/62461/1740781186-pt-41487-5.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Ella-Lift': [
      'https://www.datocms-assets.com/62461/1712178177-screenshot-2024-01-17-at-4-11-02-pm.png?auto=format,compress&w=1200'
    ],
    'Rhinoplasty': [
      'https://www.datocms-assets.com/62461/1745002350-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Rhinophyma': [
      'https://www.datocms-assets.com/62461/1696366542-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Nasolabial Folds': [
      'https://www.datocms-assets.com/62461/1717106415-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Brow Lift': [
      'https://www.datocms-assets.com/62461/1740780874-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Eyelid Surgery': [
      'https://www.datocms-assets.com/62461/1741990933-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Chin Augmentation': [
      'https://www.datocms-assets.com/62461/1745002349-05.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Ear Surgery': [
      'https://www.datocms-assets.com/62461/1717109340-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Earlobe Repair': [
      'https://www.datocms-assets.com/62461/1656123150-ad5da42d-6ee1-457a-affa-b785e37bc9b4.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Lip Lift': [
      'https://www.datocms-assets.com/62461/1740780874-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
    'Facial Implant': [
      'https://www.datocms-assets.com/62461/1656124719-2d3752bf-905b-4d9b-a2b0-e701480be6c1.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'
    ],
  },
  'Breast': {
    'Breast Asymmetry Correction': ['https://www.datocms-assets.com/62461/1752255003-001_157-1.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Breast Augmentation': ['https://www.datocms-assets.com/62461/1708027322-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Breast Augmentation and Lift': ['https://www.datocms-assets.com/62461/1708468337-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Breast Lift': ['https://www.datocms-assets.com/62461/1711495771-pt-38198-breast-lift.png?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Breast Reduction': ['https://www.datocms-assets.com/62461/1708022792-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Breast Revision': ['https://www.datocms-assets.com/62461/1708026928-pt-36730-front.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Breast Implant Exchange': ['https://www.datocms-assets.com/62461/1679530031-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Male Breast Reduction': ['https://www.datocms-assets.com/62461/1708022551-pt-36394.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
  },
  'Body': {
    'Tummy Tuck': ['https://www.datocms-assets.com/62461/1708468481-pt-38670-front-d.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Liposuction': ['https://www.datocms-assets.com/62461/1711494556-pt-39274-1.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Thigh Lift': ['https://www.datocms-assets.com/62461/1708468083-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Arm Lift': ['https://www.datocms-assets.com/62461/1711492221-pt-36938-b-a-brachioplasty-edited.png?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Body Contouring': ['https://www.datocms-assets.com/62461/1752252441-001_dsc_0016.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
  },
  'Hair': {
    'Hair Restoration': ['https://www.datocms-assets.com/62461/1743806126-pt-35702-6.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
  },
  'MESPA': {
    'Hand Lift': ['https://www.datocms-assets.com/62461/1656125600-1e640663-12c9-4723-8000-ac9c3650443e.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Dermal Fillers': ['https://www.datocms-assets.com/62461/1745529258-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Liquid Rhinoplasty': ['https://www.datocms-assets.com/62461/1656126891-026ee076-90da-4962-84a8-9c0805f20841.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Lip Fillers': ['https://www.datocms-assets.com/62461/1730472636-image.png?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Kybella': ['https://www.datocms-assets.com/62461/1656125735-29ca18aa-0c81-4f55-9f6a-afd43efe88b8.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Skin Resurfacing': ['https://www.datocms-assets.com/62461/1740780874-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'CoolSculpting': ['https://www.datocms-assets.com/62461/1740781092-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'CoolTone': ['https://www.datocms-assets.com/62461/1656122907-0db86781-ef03-47a8-a28e-bd51137d2689.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Laser Hair Removal': ['https://www.datocms-assets.com/62461/1656126171-7adbe021-fdf2-41b8-b2c4-8de251c224fd.jpg?auto=format,compress&w=1200'],
    'Morpheus8': ['https://www.datocms-assets.com/62461/1683831474-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
  },
  'Skin Cancer Care': {
    'Mohs Surgery and Skin Cancer': ['https://www.datocms-assets.com/62461/1657566967-20211208144723647-20220415152537571.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
  },
  'Men': {
    'Male Breast Reduction (Gynecomastia)': ['https://www.datocms-assets.com/62461/1708022551-pt-36394.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Male Brow Lift': ['https://www.datocms-assets.com/62461/1683831474-01.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Male Eyelid Surgery': ['https://www.datocms-assets.com/62461/1656128142-91f59b2c-a4b9-44a4-85ee-c984a334e36b.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Male Facelift': ['https://www.datocms-assets.com/62461/1656128201-6459f390-beaa-4e47-8258-a88ddcbb1044.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Male Neck Lift': ['https://www.datocms-assets.com/62461/1656128334-97b09974-1d68-4294-99fb-a01fca1aea1f.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
    'Male Rhinoplasty': ['https://www.datocms-assets.com/62461/1701732135-pt-37229-srp-front.jpg?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
  },
  'Gender Confirmation': {
    'Facial Feminization': ['https://www.datocms-assets.com/62461/1751048304-untitled-design.png?auto=format,compress&w=1200&mark=https://www.datocms-assets.com/62461/1648164937-clevens-logo-footer.png&mark-align=bottom,right&mark-pad=16&mark-alpha=75&mark-scale=15'],
  },
}



// Simplified getter functions
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

export function getImagesForAction(action: GalleryAction): GalleryImage[] {
  return getImagesByType(
    action.gallery_type,
    action.procedure_type,
    action.image_count || 2
  );
}

export function getImagesByCaseId(caseId: string): GalleryImage | undefined {
  const allImages = [
    ...galleryImagesByType.before_after,
    ...galleryImagesByType.procedure,
    ...galleryImagesByType.facility,
    ...galleryImagesByType.credentials
  ];
  
  return allImages.find(img => img.caseId && img.caseId === caseId);
}

// Fallback placeholder images
export const placeholderImages: GalleryImage[] = [
  {
    image: 'https://picsum.photos/800/400?random=100',

    caption: 'Sample patient result',
    procedure: 'general',
    description: 'Before and after comparison',
    type: 'before_after'
  }
];

