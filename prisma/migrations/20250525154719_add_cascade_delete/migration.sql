-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pdfId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "Pdf"("id") ON DELETE CASCADE ON UPDATE CASCADE;
