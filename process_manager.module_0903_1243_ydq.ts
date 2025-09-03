// 代码生成时间: 2025-09-03 12:43:06
import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';

@Module({
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class ProcessManagerModule {}

/* Process Service
 * This service handles the business logic for managing system processes.
 */
import { Injectable } from '@nestjs/common';
import { ChildProcess, spawn } from 'child_process';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ProcessService {
  constructor() {}

  /* Start a new process
   * @param command the command to execute
   * @returns an Observable of the process output
   */
  startProcess(command: string): Observable<string> {
    return new Observable((subscriber) => {
      const childProcess: ChildProcess = spawn(command, {
        shell: true,
        detached: true,
      });

      childProcess.stderr.on('data', (data) => {
        subscriber.error(data.toString());
      });

      childProcess.stdout.on('data', (data) => {
        subscriber.next(data.toString());
      });

      childProcess.on('close', (code) => {
        subscriber.complete();
      });
    }).pipe(
      catchError((error) => {
        return of(error.toString());
      }),
    );
  }

  /* Stop a process by its PID
   * @param pid the process ID to stop
   * @returns an Observable indicating the success or failure of the operation
   */
  stopProcess(pid: number): Observable<boolean> {
    return new Observable((subscriber) => {
      process.kill(pid, (err) => {
        if (err) {
          subscriber.error(err);
        } else {
          subscriber.next(true);
          subscriber.complete();
        }
      });
    });
  }
}

/* Process Controller
 * This controller handles HTTP requests related to process management.
 */
import { Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ProcessService } from './process.service';
import { Response } from 'express';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  /* Start a new process
   * @param res the response object
   * @param command the command to execute
   */
  @Post('start')
  start(@Res() res: Response, @Query('command') command: string): void {
    this.processService.startProcess(command).subscribe({
      next: (output) => {
        res.send(output);
      },
      error: (error) => {
        res.status(500).send(error);
      },
    });
  }

  /* Stop a process by its PID
   * @param res the response object
   * @param pid the process ID to stop
   */
  @Get('stop')
  stop(@Res() res: Response, @Query('pid') pid: number): void {
    this.processService.stopProcess(pid).subscribe({
      next: (success) => {
        res.send({ success });
      },
      error: (error) => {
        res.status(500).send(error);
      },
    });
  }
}
