import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          console.log(file, 'request');
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
