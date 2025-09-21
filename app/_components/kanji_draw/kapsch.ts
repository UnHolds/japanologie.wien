import { SVD } from "svd-js";
export function kabsch(
  P: number[][], // NxD array (reference points)
  Q: number[][], // NxD array (points to align)
  allowScaling: boolean = false,
): { QAligned: number[][]; R: number[][]; scale: number; t: number[] } {
  if (P.length !== Q.length)
    throw new Error("Point sets must have same length");
  const N = P.length;
  const D = P[0].length;

  // Helper: mean of vectors
  const mean = (arr: number[][]) => {
    const res = new Array(D).fill(0);
    arr.forEach((p) => {
      for (let i = 0; i < D; i++) res[i] += p[i];
    });
    return res.map((v) => v / arr.length);
  };

  // Center both sets
  const centroidP = mean(P);
  const centroidQ = mean(Q);

  const Pc = P.map((p) => p.map((v, i) => v - centroidP[i]));
  const Qc = Q.map((q) => q.map((v, i) => v - centroidQ[i]));

  // Covariance matrix C = Qc^T * Pc  (D×D)
  const C = Array.from({ length: D }, () => new Array(D).fill(0));
  for (let i = 0; i < N; i++) {
    for (let r = 0; r < D; r++) {
      for (let c = 0; c < D; c++) {
        C[r][c] += Qc[i][r] * Pc[i][c];
      }
    }
  }

  // Use numeric.js or svd-js for SVD
  // npm install svd-js
  const { u, v } = SVD(C);

  // Rotation R = U * V^T
  let R: number[][] = multiplyMatrices(v, transpose(u));

  // Ensure det(R) = +1
  if (det(R) < 0) {
    for (let i = 0; i < D; i++) u[i][D - 1] *= -1;
    R = multiplyMatrices(u, transpose(v));
  }

  // Optional scale
  let scale = 1.0;
  if (allowScaling) {
    let num = 0,
      den = 0;
    for (let i = 0; i < N; i++) {
      const q = Qc[i];
      const p = Pc[i];
      const qRot = multiplyMatrixVector(R, q);
      num += dot(p, qRot);
      den += dot(q, q);
    }
    scale = den > 0 ? num / den : 1.0;
  }

  // Align Q
  const QAligned = Qc.map((q) =>
    addVectors(
      multiplyMatrixVector(R, q).map((x) => x * scale),
      centroidP,
    ),
  );

  // Translation
  const t = centroidP.map(
    (v, i) => v - scale * multiplyMatrixVector(R, centroidQ)[i],
  );

  return { QAligned, R, scale, t };
}

// --- Helpers ---
function transpose(A: number[][]): number[][] {
  return A[0].map((_, i) => A.map((row) => row[i]));
}

function multiplyMatrices(A: number[][], B: number[][]): number[][] {
  const result = Array.from({ length: A.length }, () =>
    new Array(B[0].length).fill(0),
  );
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < B[0].length; j++) {
      for (let k = 0; k < B.length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}

function multiplyMatrixVector(A: number[][], v: number[]): number[] {
  return A.map((row) => row.reduce((sum, a, i) => sum + a * v[i], 0));
}

function dot(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function det(M: number[][]): number {
  if (M.length === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  if (M.length === 3)
    return (
      M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
      M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
      M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
    );
  throw new Error("determinant only for 2x2 or 3x3");
}

function addVectors(a: number[], b: number[]): number[] {
  return a.map((v, i) => v + b[i]);
}
