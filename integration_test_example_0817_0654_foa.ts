// 代码生成时间: 2025-08-17 06:54:38
 * This module demonstrates how to write a simple integration test for a NestJS module.
 * The example includes a basic setup for a module, a controller, and a service.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from 'supertest';
import { AppModule as AppModule } from './app.module'; // assuming the app module has the necessary providers and controllers

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});
