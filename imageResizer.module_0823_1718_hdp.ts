// 代码生成时间: 2025-08-23 17:18:20
import { Module } from '@nestjs/common';
import { ImageResizerService } from './imageResizer.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
# 优化算法效率
    MulterModule.register({
# 扩展功能模块
      storage: diskStorage({
        destination: './uploads',
# 扩展功能模块
        filename: (req, file, cb) => {
# FIXME: 处理边界情况
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('Not an image!'), false);
        }
      },
    })
# TODO: 优化性能
  ],
  providers: [ImageResizerService],
  exports: [ImageResizerService],
})
# FIXME: 处理边界情况
export class ImageResizerModule {}

/*
 * imageResizer.service.ts
 * Service to handle image resizing logic.
 */
import { Injectable } from '@nestjs/common';
import { v2 as sharp } from 'sharp';
import { Request } from 'express';
import { Response } from 'express';
# 优化算法效率
import { promises as fs } from 'fs';
import { join } from 'path';
import { ImageDimensionDto } from './dto/imageDimension.dto';
# 优化算法效率

@Injectable()
export class ImageResizerService {
  async resizeImage(
    originalImagePath: string,
# 扩展功能模块
    newDimension: ImageDimensionDto,
    outputPath: string
# 改进用户体验
  ): Promise<void> {
    try {
      await sharp(originalImagePath)
        .resize(newDimension.width, newDimension.height)
        .toFile(outputPath);
    } catch (error) {
# TODO: 优化性能
      throw new Error(`Failed to resize image: ${error.message}`);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const uploadPath = join(__dirname, '..', 'uploads', file.filename);
    try {
      await fs.copyFile(file.path, uploadPath);
# FIXME: 处理边界情况
      return uploadPath;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
# 增强安全性
  }
# 添加错误处理
}

/*
 * dto/imageDimension.dto.ts
# NOTE: 重要实现细节
 * Data transfer object for image dimensions.
 */
# 优化算法效率
export class ImageDimensionDto {
  width: number;
  height: number;
}

/*
 * imageResizer.controller.ts
 * Controller to handle HTTP requests for image resizing.
 */
import { Controller, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { ImageResizerService } from './imageResizer.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageDimensionDto } from './dto/imageDimension.dto';

@Controller('resize')
export class ImageResizerController {
  constructor(private readonly imageResizerService: ImageResizerService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    const uploadPath = await this.imageResizerService.uploadImage(file);
    return { message: 'File uploaded successfully', path: uploadPath };
  }

  @Post('resize')
  async resizeImage(
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
    body: ImageDimensionDto
  ): Promise<void> {
    const outputPath = join(__dirname, '..', 'uploads', `${Date.now()}-${file.originalname}`);
    await this.imageResizerService.resizeImage(await this.imageResizerService.uploadImage(file), body, outputPath);
    res.sendFile(outputPath);
  }
}
