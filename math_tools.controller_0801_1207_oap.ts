// 代码生成时间: 2025-08-01 12:07:53
import { Controller, Get, Query, NotFoundException, HttpStatus } from '@nestjs/common';

// DTO for handling mathematical operations
class MathOperationDto {
  readonly operandA: number;
  readonly operandB: number;
  readonly operation: string; // 'add', 'subtract', 'multiply', 'divide'
}

@Controller('math-tools')
export class MathToolsController {

  /**
   * Perform an addition operation.
   * @param dto MathOperationDto object containing the operands and the operation type.
   */
  @Get('add')
  async add(@Query() dto: MathOperationDto): Promise<number> {
    return this.performOperation(dto.operandA, dto.operandB, 'add');
  }

  /**
   * Perform a subtraction operation.
   * @param dto MathOperationDto object containing the operands and the operation type.
   */
  @Get('subtract')
  async subtract(@Query() dto: MathOperationDto): Promise<number> {
    return this.performOperation(dto.operandA, dto.operandB, 'subtract');
  }

  /**
   * Perform a multiplication operation.
   * @param dto MathOperationDto object containing the operands and the operation type.
   */
  @Get('multiply')
  async multiply(@Query() dto: MathOperationDto): Promise<number> {
    return this.performOperation(dto.operandA, dto.operandB, 'multiply');
  }

  /**
   * Perform a division operation.
   * @param dto MathOperationDto object containing the operands and the operation type.
   */
  @Get('divide')
  async divide(@Query() dto: MathOperationDto): Promise<number> {
    return this.performOperation(dto.operandA, dto.operandB, 'divide');
  }

  /**
   * Perform the specified mathematical operation.
   *
   * @param operandA The first number (operand).
   * @param operandB The second number (operand).
   * @param operation The type of operation to perform.
   *
   * @throws NotFoundException if the operation is not supported.
   * @returns The result of the operation.
   */
  private performOperation(operandA: number, operandB: number, operation: string): number {
    switch (operation) {
      case 'add':
        return operandA + operandB;
      case 'subtract':
        return operandA - operandB;
      case 'multiply':
        return operandA * operandB;
      case 'divide':
        if (operandB === 0) {
          throw new NotFoundException("You can't divide by zero.");
        }
        return operandA / operandB;
      default:
        throw new NotFoundException("Unsupported operation.");
    }
  }
}
