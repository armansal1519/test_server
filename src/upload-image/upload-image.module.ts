import { Module } from '@nestjs/common';
import { UploadImageController } from './upload-image.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './images',
    }),
  ],
  controllers: [UploadImageController],
})
export class UploadImageModule {}
