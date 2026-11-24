// Shared motion math for the court diagrams.
// A path is a list of [x, y, time] stops with time running 0 to 1.
export type Stop = [number, number, number];
export type Point = [number, number];

const same = (p: Stop, q: Stop) => p[0] === q[0] && p[1] === q[1];

// Catmull-Rom: a smooth curve that passes through every stop.
function spline(a: number, b: number, c: number, d: number, u: number) {
  return 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u * u + (-a + 3 * b - 3 * c + d) * u * u * u);
}

export const easeInOut = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

// Where a player is at time t. Movement curves through the stops, eases out of
// a standstill and into one, and holds perfectly still between two equal stops.
export function at(path: Stop[], t: number): Point {
  const n = path.length;
  if (t <= path[0][2]) return [path[0][0], path[0][1]];
  if (t >= path[n - 1][2]) return [path[n - 1][0], path[n - 1][1]];
  let i = 1;
  while (i < n - 1 && t > path[i][2]) i++;
  const b = path[i - 1];
  const c = path[i];
  if (same(b, c)) return [b[0], b[1]];
  const fromRest = i - 2 < 0 || same(path[i - 2], b);
  const toRest = i + 1 > n - 1 || same(path[i + 1], c);
  const a = fromRest ? b : path[i - 2];
  const d = toRest ? c : path[i + 1];
  let u = (t - b[2]) / (c[2] - b[2] || 1);
  if (fromRest && toRest) u = easeInOut(u);
  else if (fromRest) u = Math.pow(u, 1.7);
  else if (toRest) u = 1 - Math.pow(1 - u, 1.7);
  return [spline(a[0], b[0], c[0], d[0], u), spline(a[1], b[1], c[1], d[1], u)];
}

export const lerp = (p: Point, q: Point, u: number): Point => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
