ALTER TABLE "Categories" ADD COLUMN IF NOT EXISTS "Type" integer NOT NULL DEFAULT 0;
ALTER TABLE "Categories" ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp with time zone;
ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "Specifications" text;
ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "Features" text;
ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp with time zone;
ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "CategoryId" uuid;
ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "Thumbnail" text;
ALTER TABLE "Projects" ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp with time zone;
ALTER TABLE "BlogPosts" ADD COLUMN IF NOT EXISTS "UpdatedAt" timestamp with time zone;
