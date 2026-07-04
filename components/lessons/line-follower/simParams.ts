export interface SimParams {
  baseSpeed: number;   // 0–255 PWM
  threshold: number;   // sensor comparator threshold (mV) — pedagogical
  kp: number;
  ki: number;
  kd: number;
  accel: number;       // 0–50 acceleration limit
  turnSens: number;    // 0–100 turning sensitivity
}

export const DEFAULT_PARAMS: SimParams = {
  baseSpeed: 170,
  threshold: 500,
  kp: 45,
  ki: 0,
  kd: 22,
  accel: 20,
  turnSens: 50,
};
