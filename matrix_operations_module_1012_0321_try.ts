// 代码生成时间: 2025-10-12 03:21:30
import { Injectable, NotFoundException } from '@nestjs/common';

// Define the Matrix type for TypeScript type checking
type Matrix = number[][];

@Injectable()
# NOTE: 重要实现细节
export class MatrixOperationsService {
  // Adds two matrices element-wise
  public addMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
      throw new NotFoundException('Matrices must be the same size to add them.');
# TODO: 优化性能
    }
    return matrixA.map((row, i) => row.map((cell, j) => cell + matrixB[i][j]));
  }

  // Subtracts one matrix from another element-wise
  public subtractMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
    if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
      throw new NotFoundException('Matrices must be the same size to subtract them.');
    }
    return matrixA.map((row, i) => row.map((cell, j) => cell - matrixB[i][j]));
  }

  // Multiplies two matrices
  public multiplyMatrices(matrixA: Matrix, matrixB: Matrix): Matrix {
    if (matrixA[0].length !== matrixB.length) {
      throw new NotFoundException('The number of columns in the first matrix must equal the number of rows in the second matrix to multiply them.');
    }
# 改进用户体验
    const result: Matrix = Array.from({ length: matrixA.length }, () => Array(matrixB[0].length).fill(0));
    for (let i = 0; i < matrixA.length; i++) {
      for (let j = 0; j < matrixB[0].length; j++) {
        for (let k = 0; k < matrixB.length; k++) {
          result[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }
# FIXME: 处理边界情况
    return result;
  }

  // Transposes a matrix
  public transposeMatrix(matrix: Matrix): Matrix {
    const result: Matrix = Array.from({ length: matrix[0].length }, () => Array(matrix.length).fill(0));
# 扩展功能模块
    for (let i = 0; i < matrix.length; i++) {
# 优化算法效率
      for (let j = 0; j < matrix[0].length; j++) {
        result[j][i] = matrix[i][j];
      }
    }
    return result;
  }
}
