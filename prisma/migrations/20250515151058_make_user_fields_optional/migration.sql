/*
  Warnings:

  - Made the column `paymentDetails` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "paymentDetails" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone_number" DROP NOT NULL,
ALTER COLUMN "avatar_url" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;
