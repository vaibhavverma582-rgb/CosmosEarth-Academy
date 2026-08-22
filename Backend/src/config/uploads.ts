/**
 * Shared upload directory configuration.
 * 
 * On Render with persistent disk, set UPLOAD_DIR to the disk mount path.
 * e.g., UPLOAD_DIR=/opt/render/project/src/uploads
 * 
 * Locally it defaults to Backend/uploads/
 */

import * as path from "path";

const BASE_UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads");

export const UPLOAD_DIRS = {
  base: BASE_UPLOAD_DIR,
  notes: path.join(BASE_UPLOAD_DIR, "notes"),
  blog: path.join(BASE_UPLOAD_DIR, "blog"),
  gallery: path.join(BASE_UPLOAD_DIR, "gallery"),
  wallpaper: path.join(BASE_UPLOAD_DIR, "wallpaper"),
  videos: path.join(BASE_UPLOAD_DIR, "videos"),
  studyMaterials: path.join(BASE_UPLOAD_DIR, "study-materials"),
};

/**
 * Get the public URL path for an uploaded file.
 * This is what gets stored in the database and served to the frontend.
 */
export function getUploadUrl(subdir: string, filename: string): string {
  return `/uploads/${subdir}/${filename}`;
}
