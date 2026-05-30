/**
 * Gumroad integration for The Spiral's Whisper
 * 
 * Setup:
 * 1. Create a Gumroad account at https://gumroad.com
 * 2. Create a product (name it "Unlock The Spiral's Whisper")
 * 3. Set the price (e.g., $2.99)
 * 4. Get your Product ID from the product URL
 * 5. Enable "License Key" in product settings
 * 6. Add keys to .env.local
 */

// Gumroad checkout link builder
export const generateGumroadCheckoutUrl = (
  username: string,
  productId: string,
  email?: string
): string => {
  const baseUrl = `https://gumroad.com/checkout/${productId}`;
  const params = new URLSearchParams();
  
  // Redirect to your unlock page after purchase
  params.append("success_url", `${window.location.origin}/unlock?success=1`);
  
  // Pre-fill email if provided
  if (email) {
    params.append("email", email);
  }
  
  return `${baseUrl}?${params.toString()}`;
};

// Verify license key (optional - for advanced usage)
export const verifyLicenseKey = async (licenseKey: string): Promise<boolean> => {
  try {
    // This would typically be a backend call to verify the license
    // For now, we just trust Gumroad's redirect verification
    return true;
  } catch (error) {
    console.error("License verification failed:", error);
    return false;
  }
};
