// 代码生成时间: 2025-07-31 19:22:51
import { Injectable } from '@nestjs/common';
import { MulterOptions,.Multer } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from './cloudinary-storage';
import { diskStorage } from 'multer';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

// Configuration for multer and cloudinary
const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now());
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\bimage\b/)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Not an image! Please upload an image file.'), false);
    }
  },
};

@Injectable()
export class ResizeImagesService {
  constructor(private readonly multer: Multer) {}

  async uploadImages(files: Express.Multer.File[]): Promise<void> {
    try {
      for (const file of files) {
        await this.resizeImage(file);
      }
    } catch (error) {
      throw new Error('Failed to upload images.');
    }
  }

  private async resizeImage(file: Express.Multer.File): Promise<void> {
    const newWidth = 800; // New width for resizing
    const newHeight = 600; // New height for resizing
    const outputDir = './resized-uploads/';
    const outputPath = path.join(outputDir, file.filename);
    const inputPath = path.join('./uploads/', file.filename);

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Resize the image
    await sharp(inputPath)
      .resize({
        width: newWidth,
        height: newHeight,
      }).toFile(outputPath);
  }

  async deleteImage(filename: string): Promise<void> {
    const filePath = path.join('./uploads/', filename);
    const resizedFilePath = path.join('./resized-uploads/', filename);

    try {
      fs.unlinkSync(filePath);
      fs.unlinkSync(resizedFilePath);
    } catch (error) {
      throw new Error('Failed to delete images.');
    }
  }
}