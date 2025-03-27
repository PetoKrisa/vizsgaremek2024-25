-- AddForeignKey
ALTER TABLE `eventcomment` ADD CONSTRAINT `eventcomment_topLevelCommentId_fkey` FOREIGN KEY (`topLevelCommentId`) REFERENCES `eventcomment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
