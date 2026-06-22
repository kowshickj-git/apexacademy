// Dense linear-algebra core for the MNA solver.
// Gaussian elimination with partial pivoting. Dependency-free.
// Sufficient for educational circuit sizes (< ~300 unknowns); see design doc §6.6.

export type Matrix = number[][];
export type Vector = number[];

/** Allocate an n×n zero matrix. */
export function zeros(n: number): Matrix {
  const m: Matrix = new Array(n);
  for (let i = 0; i < n; i++) m[i] = new Array(n).fill(0);
  return m;
}

/** Allocate a length-n zero vector. */
export function zeroVec(n: number): Vector {
  return new Array(n).fill(0);
}

/**
 * Solve A·x = b in place-safe fashion (A and b are copied).
 * Returns null if the system is singular (no unique solution).
 */
export function solve(A: Matrix, b: Vector): Vector | null {
  const n = b.length;
  if (n === 0) return [];

  // Work on copies so callers can reuse their matrices.
  const M: Matrix = A.map((row) => row.slice());
  const x: Vector = b.slice();

  for (let col = 0; col < n; col++) {
    // Partial pivot: find the largest magnitude entry in this column.
    let pivot = col;
    let max = Math.abs(M[col][col]);
    for (let r = col + 1; r < n; r++) {
      const v = Math.abs(M[r][col]);
      if (v > max) {
        max = v;
        pivot = r;
      }
    }
    if (max < 1e-18) return null; // singular

    if (pivot !== col) {
      const tmp = M[pivot];
      M[pivot] = M[col];
      M[col] = tmp;
      const tb = x[pivot];
      x[pivot] = x[col];
      x[col] = tb;
    }

    // Eliminate below the pivot.
    const pv = M[col][col];
    for (let r = col + 1; r < n; r++) {
      const factor = M[r][col] / pv;
      if (factor === 0) continue;
      for (let c = col; c < n; c++) M[r][c] -= factor * M[col][c];
      x[r] -= factor * x[col];
    }
  }

  // Back-substitution.
  for (let row = n - 1; row >= 0; row--) {
    let sum = x[row];
    for (let c = row + 1; c < n; c++) sum -= M[row][c] * x[c];
    const diag = M[row][row];
    if (Math.abs(diag) < 1e-18) return null;
    x[row] = sum / diag;
  }

  for (let i = 0; i < n; i++) {
    if (!Number.isFinite(x[i])) return null;
  }
  return x;
}
