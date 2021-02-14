import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  editFileName,
  imageFileFilter,
} from '../upload-image/file-uploading.utils';
import { diskStorage } from 'multer';

@Controller('upload-file')
export class UploadFileController {
  @Get('/:filepath')
  seeUploadedFile(@Param('filepath') file, @Res() res) {
    console.log(file);
    return res.sendFile(file, { root: './file' });
  }

  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('file', 5, {
      limits: {
        fileSize: 50000000,
      },
      storage: diskStorage({
        destination: './file',
        filename: editFileName,
      }),
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    console.log(files);
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        url: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }
}
