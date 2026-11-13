const IMAGE_ASSET_BASE = String(import.meta.env.VITE_IMAGE_BASE_URL || "https://nk-admin.onrender.com").replace(/\/+$/, "");

export const resolveImageUrl = (source?: string | null): string => {
  const value = String(source || "").trim();
  if (!value) return IMAGE_ASSET_BASE + "/images/no-image.jpg";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;
  if (value.startsWith("//")) return "https:" + value;
  if (value.startsWith("/")) return IMAGE_ASSET_BASE + value;
  const normalized = value.replace(/^\.\//, "").replace(/^public\//, "");
  return IMAGE_ASSET_BASE + (normalized.startsWith("images/") ? "/" : "/images/") + normalized;
};
