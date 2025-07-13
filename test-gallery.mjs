import { 
  getImagesByCategory, 
  getImagesByProcedure, 
  getAllImages, 
  getAvailableCategories,
  newGalleryImagesByType 
} from './data/galleryImages.ts';

console.log('🧪 Testing Gallery Functions\n');

// Test 1: Check if newGalleryImagesByType is loaded
console.log('1. Available categories:');
try {
  const categories = getAvailableCategories();
  console.log('   ✅', categories);
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 2: Get images by category
console.log('\n2. Face category images (first 2):');
try {
  const faceImages = getImagesByCategory('Face', 2);
  console.log('   ✅ Found', faceImages.length, 'images');
  if (faceImages.length > 0) {
    console.log('   📸 Sample:', faceImages[0].caption);
  }
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 3: Search for rhinoplasty
console.log('\n3. Rhinoplasty images:');
try {
  const rhinoplastyImages = getImagesByProcedure('rhinoplasty', 1);
  console.log('   ✅ Found', rhinoplastyImages.length, 'images');
  if (rhinoplastyImages.length > 0) {
    console.log('   📸 Sample:', rhinoplastyImages[0].caption);
    console.log('   🔗 URL:', rhinoplastyImages[0].image.substring(0, 50) + '...');
  }
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 4: Get all images
console.log('\n4. All images (first 3):');
try {
  const allImages = getAllImages(3);
  console.log('   ✅ Found', allImages.length, 'images');
  allImages.forEach((img, i) => {
    console.log(`   ${i + 1}. ${img.caption} (${img.procedure})`);
  });
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

console.log('\n🎯 Gallery test completed!');