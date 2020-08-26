import { Module } from '@nestjs/common';
import { UploadImageController } from './upload-image.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [UploadImageController],
})
export class UploadImageModule {}
