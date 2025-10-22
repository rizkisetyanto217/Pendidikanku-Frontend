/**
 * User Profile Utilities
 * Helper functions untuk manage user profile di localStorage
 */

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  role?: string;
}

const USER_PROFILE_KEY = "user_profile";

/**
 * Save user profile ke localStorage
 */
export function saveUserProfile(userData: any): UserProfile {
  const userProfile: UserProfile = {
    name: userData.name || userData.full_name || userData.username || "User",
    email: userData.email || "",
    avatar:
      userData.avatar || userData.profile_picture || userData.profile_photo_url,
    phone: userData.phone || userData.phone_number,
    role: userData.role,
  };

  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
  console.log("✅ User profile saved:", userProfile);

  return userProfile;
}

/**
 * Get user profile dari localStorage
 */
export function getUserProfile(): UserProfile | null {
  try {
    const saved = localStorage.getItem(USER_PROFILE_KEY);
    if (!saved) return null;

    return JSON.parse(saved) as UserProfile;
  } catch (error) {
    console.error("❌ Error parsing user profile:", error);
    return null;
  }
}

/**
 * Update specific field di user profile
 */
export function updateUserProfile(
  updates: Partial<UserProfile>
): UserProfile | null {
  const current = getUserProfile();
  if (!current) return null;

  const updated = { ...current, ...updates };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));

  return updated;
}

/**
 * Clear user profile dari localStorage
 */
export function clearUserProfile(): void {
  localStorage.removeItem(USER_PROFILE_KEY);
}

/**
 * Get initials dari nama (untuk avatar fallback)
 */
export function getInitials(name: string): string {
  if (!name) return "U";

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Translate role ke Bahasa Indonesia
 */
export function translateRole(role: string): string {
  const roleMap: Record<string, string> = {
    teacher: "Guru",
    guru: "Guru",
    student: "Murid",
    murid: "Murid",
    dkm: "Admin Sekolah",
    admin: "Admin Sekolah",
    sekolah: "Admin Sekolah",
    user: "Pengguna",
  };

  return roleMap[role?.toLowerCase()] || "Pengguna";
}

/**
 * Check apakah user sudah login (ada user profile)
 */
export function isUserLoggedIn(): boolean {
  return getUserProfile() !== null;
}
