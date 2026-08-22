/**
 * SQLite → PostgreSQL Data Migration Script
 * 
 * This script reads the SQLite dump (sqlite-dump.json) and inserts all data
 * into the PostgreSQL database via Prisma.
 * 
 * Usage:
 *   1. Make sure DATABASE_URL in .env points to your PostgreSQL database
 *   2. Run: npx prisma db push (to create tables)
 *   3. Run: npx tsx scripts/migrate-data.ts
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface MigrationResult {
  model: string;
  total: number;
  inserted: number;
  skipped: number;
  errors: string[];
}

async function migrateData(): Promise<MigrationResult[]> {
  const dumpPath = path.join(__dirname, "..", "sqlite-dump.json");

  if (!fs.existsSync(dumpPath)) {
    console.error("❌ sqlite-dump.json not found. Run the dump script first.");
    process.exit(1);
  }

  const dump = JSON.parse(fs.readFileSync(dumpPath, "utf-8"));
  const results: MigrationResult[] = [];

  // Migration order matters due to foreign keys
  // Parents first, then children
  const migrationOrder = [
    // Auth & Users
    { key: "user", model: "user" },
    { key: "account", model: "account" },
    { key: "session", model: "session" },
    { key: "verificationToken", model: "verificationToken" },
    { key: "otpCode", model: "otpCode" },

    // Content
    { key: "category", model: "category" },
    { key: "wallpaper", model: "wallpaper" },
    { key: "course", model: "course" },
    { key: "module", model: "module" },
    { key: "lesson", model: "lesson" },
    { key: "enrollment", model: "enrollment" },
    { key: "review", model: "review" },
    { key: "courseProgress", model: "courseProgress" },

    // Notes
    { key: "note", model: "note" },
    { key: "noteBookmark", model: "noteBookmark" },
    { key: "noteTag", model: "noteTag" },

    // Media
    { key: "galleryImage", model: "galleryImage" },
    { key: "video", model: "video" },
    { key: "playlist", model: "playlist" },
    { key: "playlistItem", model: "playlistItem" },
    { key: "watchProgress", model: "watchProgress" },

    // Documentaries
    { key: "documentary", model: "documentary" },
    { key: "watchlistItem", model: "watchlistItem" },

    // Podcasts
    { key: "podcast", model: "podcast" },
    { key: "podcastEpisode", model: "podcastEpisode" },
    { key: "podcastFavorite", model: "podcastFavorite" },
    { key: "podcastSubscription", model: "podcastSubscription" },
    { key: "listeningHistory", model: "listeningHistory" },

    // Quizzes
    { key: "quiz", model: "quiz" },
    { key: "quizQuestion", model: "quizQuestion" },
    { key: "quizAttempt", model: "quizAttempt" },

    // Blog & Study Materials
    { key: "blogPost", model: "blogPost" },
    { key: "studyMaterial", model: "studyMaterial" },
  ];

  // Map Prisma model names to JSON dump keys
  // The dump uses Prisma model names, which match the keys above

  for (const { key, model } of migrationOrder) {
    const rows = dump[key] || dump[model] || [];
    const result: MigrationResult = {
      model: model,
      total: rows.length,
      inserted: 0,
      skipped: 0,
      errors: [],
    };

    if (rows.length === 0) {
      console.log(`⏭️  ${model}: 0 records (skipping)`);
      results.push(result);
      continue;
    }

    console.log(`📥 ${model}: ${rows.length} records to migrate...`);

    for (const row of rows) {
      try {
        // Remove any fields that don't exist in the PostgreSQL schema
        // SQLite might have auto-generated fields that PostgreSQL handles differently
        const cleanRow = { ...row };

        // Ensure dates are proper Date objects
        for (const [k, v] of Object.entries(cleanRow)) {
          if (v === null || v === undefined) {
            delete cleanRow[k];
          }
          // Convert string dates to Date objects for DateTime fields
          if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
            cleanRow[k] = new Date(v);
          }
          // Ensure booleans are actual booleans (SQLite uses 0/1)
          if (typeof v === "number" && (k.includes("active") || k.includes("published") || k.includes("featured") || k.includes("completed") || k.includes("used") || k.includes("passed"))) {
            cleanRow[k] = Boolean(v);
          }
        }

        // Use upsert with the id to avoid duplicates
        await (prisma as any)[model].upsert({
          where: { id: cleanRow.id },
          create: cleanRow,
          update: cleanRow,
        });
        result.inserted++;
      } catch (error: any) {
        const errMsg = error.message?.slice(0, 120) || "Unknown error";
        result.errors.push(`ID ${row.id}: ${errMsg}`);
        result.skipped++;
      }
    }

    if (result.errors.length > 0) {
      console.log(`   ⚠️  ${result.skipped} skipped due to errors:`);
      result.errors.forEach((e) => console.log(`      ${e}`));
    }
    console.log(`   ✅ ${result.inserted}/${result.total} inserted`);
    results.push(result);
  }

  return results;
}

async function main() {
  console.log("🚀 Starting SQLite → PostgreSQL data migration\n");
  console.log("━".repeat(60));

  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database\n");

    const results = await migrateData();

    // Summary
    console.log("\n" + "━".repeat(60));
    console.log("📊 MIGRATION SUMMARY\n");

    let totalRecords = 0;
    let totalInserted = 0;
    let totalSkipped = 0;

    for (const r of results) {
      totalRecords += r.total;
      totalInserted += r.inserted;
      totalSkipped += r.skipped;
      const status = r.skipped === 0 ? "✅" : "⚠️";
      console.log(`${status} ${r.model}: ${r.inserted}/${r.total} migrated${r.skipped > 0 ? ` (${r.skipped} skipped)` : ""}`);
    }

    console.log("\n" + "━".repeat(60));
    console.log(`Total: ${totalInserted}/${totalRecords} records migrated`);
    if (totalSkipped > 0) {
      console.log(`⚠️  ${totalSkipped} records were skipped due to errors`);
    }
    console.log("━".repeat(60));

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
