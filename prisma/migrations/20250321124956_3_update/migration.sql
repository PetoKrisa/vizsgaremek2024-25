-- DropForeignKey
ALTER TABLE `eventcomment` DROP FOREIGN KEY `eventcomment_topLevelCommentId_fkey`;

-- AddForeignKey
ALTER TABLE `eventcomment` ADD CONSTRAINT `eventcomment_topLevelCommentId_fkey` FOREIGN KEY (`topLevelCommentId`) REFERENCES `eventcomment`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `eventcomment` ADD CONSTRAINT `eventcomment_superCommentId_fkey` FOREIGN KEY (`superCommentId`) REFERENCES `eventcomment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
