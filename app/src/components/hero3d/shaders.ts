/* GLSL ES 3.00 shaders for the CONDUIT hero. */

export const SHOE_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNrm;
layout(location = 2) in vec2 aUv;
uniform mat4 uModel;
uniform mat4 uViewProj;
uniform mat3 uNrmMat;
out vec3 vWorld;
out vec3 vN;
out vec2 vUv;
out vec3 vLocal;
void main() {
  vec4 w = uModel * vec4(aPos, 1.0);
  vWorld = w.xyz;
  vN = uNrmMat * aNrm;
  vUv = aUv;
  vLocal = aPos;
  gl_Position = uViewProj * w;
}
`

export const SHOE_FS = /* glsl */ `#version 300 es
precision highp float;
in vec3 vWorld;
in vec3 vN;
in vec2 vUv;
in vec3 vLocal;
uniform int uPart;
uniform vec3 uCam;
uniform float uTime;
uniform float uScan;
uniform float uMirror;
out vec4 outColor;

const vec3 EMERALD = vec3(0.063, 0.725, 0.506);
const vec3 EMERALD_HOT = vec3(0.35, 1.0, 0.72);
const vec3 CYAN = vec3(0.0, 0.94, 1.0);

float aaLine(float d, float w) {
  float fw = max(fwidth(d), 1e-5);
  return 1.0 - smoothstep(w - fw, w + fw, abs(d));
}
float band(float x, float a, float b) {
  float fw = max(fwidth(x), 1e-5);
  return smoothstep(a - fw, a + fw, x) * (1.0 - smoothstep(b - fw, b + fw, x));
}
float sstep(float a, float b, float x) { return smoothstep(a, b, x); }
vec2 P(float t, float h) { return vec2(t * 2.8, h * 0.9); }

// signed distance to a convex/concave quad (Inigo Quilez polygon SDF)
float sdQuad(vec2 p, vec2 a, vec2 b, vec2 c, vec2 d) {
  vec2 v[4];
  v[0] = a; v[1] = b; v[2] = c; v[3] = d;
  float dist = dot(p - v[0], p - v[0]);
  float sgn = 1.0;
  for (int i = 0; i < 4; i++) {
    int j = (i + 3) % 4;
    vec2 e = v[j] - v[i];
    vec2 w = p - v[i];
    vec2 bb = w - e * clamp(dot(w, e) / dot(e, e), 0.0, 1.0);
    dist = min(dist, dot(bb, bb));
    bool c1 = p.y >= v[i].y;
    bool c2 = p.y < v[j].y;
    bool c3 = e.x * w.y > e.y * w.x;
    if ((c1 && c2 && c3) || (!c1 && !c2 && !c3)) sgn = -sgn;
  }
  return sgn * sqrt(dist);
}

// distance from a hex-cell edge (0 on the edge, ~0.5 at the centre)
float hexEdge(vec2 p) {
  vec2 r = vec2(1.0, 1.7320508);
  vec2 hh = r * 0.5;
  vec2 a = mod(p, r) - hh;
  vec2 b = mod(p - hh, r) - hh;
  vec2 g = dot(a, a) < dot(b, b) ? a : b;
  vec2 q = abs(g);
  return 0.5 - max(q.x * 0.5 + q.y * 0.8660254, q.x);
}

// 2x2 twill weave, returns 0..1 fibre brightness
float carbon(vec2 p) {
  vec2 c = floor(p);
  vec2 f = fract(p);
  float chk = mod(c.x + c.y, 2.0);
  float fib = chk > 0.5 ? sin(f.x * 3.14159) : sin(f.y * 3.14159);
  return mix(0.35, 1.0, fib) * (chk > 0.5 ? 1.0 : 0.7);
}

// Procedural studio environment: overhead softbox, two strip lights, emerald floor bounce.
vec3 env(vec3 d, float r) {
  float up = d.y;
  vec3 c = mix(vec3(0.006, 0.007, 0.008), vec3(0.03, 0.032, 0.036), sstep(-0.3, 0.8, up));
  float soft = 0.06 + r * 0.35;
  float peak = mix(1.0, 0.18, r);
  c += vec3(1.0, 0.98, 0.95) * 2.6 * peak * sstep(0.78 - soft, 0.86 + soft * 0.3, up);
  float az = atan(d.x, d.z);
  float stripW = 0.1 + r * 0.5;
  float vert = sstep(-0.25, 0.1, up) * (1.0 - sstep(0.7, 0.95, up));
  c += vec3(0.9, 0.95, 1.0) * 1.4 * peak * vert * (1.0 - sstep(stripW * 0.5, stripW, abs(az - 1.95)));
  c += vec3(0.85, 0.9, 1.0) * 0.9 * peak * vert * (1.0 - sstep(stripW * 0.5, stripW, abs(az + 2.2)));
  c += EMERALD * 0.06 * exp(-up * up * 18.0);
  return c;
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec3 V = normalize(uCam - vWorld);
  vec3 N = normalize(vN);
  vec3 ng = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  // winding-agnostic back-face detection (works for mirrored draw too)
  bool back = dot(ng, V) * dot(ng, N) < 0.0;
  if (back) N = -N;
  if (dot(N, V) < 0.0) N = normalize(N + V * (-dot(N, V) + 0.02));

  vec3 albedo = vec3(0.04);
  float rough = 0.6;
  float f0 = 0.04;
  vec3 emit = vec3(0.0);
  float t = vUv.x;

  if (uPart == 0) {
    // ---------- upper ----------
    // panel space: q ≈ world units across the side of the shoe (t along, h up)
    float v = vUv.y;
    float h = 1.0 - abs(1.0 - 2.0 * v);
    vec2 q = vec2(t * 2.8, h * 0.9);
    // engineered hex mesh base
    float hx = hexEdge(q * 62.0);
    float meshAA = 1.0 - smoothstep(0.25, 0.7, fwidth(q.x * 62.0));
    float cell = mix(0.5, smoothstep(0.02, 0.12, hx), meshAA);
    albedo = vec3(0.022, 0.024, 0.026) * (0.55 + 0.6 * cell);
    rough = 0.78;

    // ----- overlay panels (glossy TPU), as signed distances in q-space -----
    float dHeel = sdQuad(q, P(0.0, -0.1), P(0.345, -0.1), P(0.15, 0.9), P(-0.1, 1.05));
    // sits below the collar cut-out (the side wall only reaches h≈0.65 at the heel)
    float dWinH = sdQuad(q, P(0.03, 0.58), P(0.19, 0.53), P(0.14, 0.3), P(0.06, 0.25));
    float dMidO = sdQuad(q, P(0.35, 0.7), P(0.55, 0.7), P(0.51, 0.34), P(0.39, 0.38));
    float dMidI = dMidO + 0.04;
    float toeB = 0.1 + 0.9 * abs(t - 0.82);
    // chevron strap across the forefoot (toe tip stays matte mesh)
    float dToe = (abs(h - toeB - 0.06) - 0.05) * 0.9 * step(0.6, t) + (1.0 - step(0.6, t)) * 1.0;
    float dMud = (h - 0.11) * 0.9;
    float dEye = max(abs(h - 0.8) * 0.9 - 0.055, max(0.44 - t, t - 0.745) * 2.8);
    float panel = min(min(dHeel, dToe), min(dMud, dEye));
    panel = min(panel, max(dMidO, -dMidI)); // window frame ring
    panel = max(panel, -dWinH);             // cut the heel window out

    float fwq = max(fwidth(q.x), 1e-5);
    float onPanel = 1.0 - smoothstep(-fwq, fwq, panel);
    albedo = mix(albedo, vec3(0.014, 0.015, 0.016), onPanel);
    rough = mix(rough, 0.18, onPanel);
    f0 = mix(f0, 0.06, onPanel);

    // recessed windows: darker, deeper mesh showing through
    float inWin = (1.0 - smoothstep(-fwq, fwq, dWinH)) + (1.0 - smoothstep(-fwq, fwq, dMidI));
    albedo = mix(albedo, vec3(0.006, 0.008, 0.008) * (0.4 + 1.2 * cell), clamp(inWin, 0.0, 1.0));
    rough = mix(rough, 0.9, clamp(inWin, 0.0, 1.0));

    // bevel: bright lip on the panel edge, soft occlusion just outside it
    float lip = aaLine(panel + 0.004, 0.0028);
    albedo += vec3(0.13, 0.135, 0.14) * lip;
    albedo *= 1.0 - 0.45 * (1.0 - smoothstep(0.0, 0.022, panel)) * step(0.0, panel);
    // secondary chevron seam on the toe
    albedo += vec3(0.05) * aaLine((h - toeB - 0.09) * 0.9, 0.0022) * step(0.62, t);

    // throat under the laces
    float throat = band(t, 0.49, 0.74) * sstep(0.84, 0.88, h);
    albedo = mix(albedo, vec3(0.04, 0.043, 0.045), throat);

    // faint green light leaking from the edges of the recessed windows
    float winGlow = aaLine(dWinH + 0.006, 0.002) + aaLine(dMidI + 0.006, 0.002);
    emit += EMERALD * winGlow * 0.9;
    // emissive: diagonal telemetry line down the heel-counter edge + heel pod
    float diag = aaLine(dHeel, 0.0045) * band(h, 0.1, 0.93);
    emit += EMERALD_HOT * diag * 1.25;
    if (back) { albedo = vec3(0.018, 0.03, 0.026); rough = 0.9; f0 = 0.04; emit *= 0.0; }
  } else if (uPart == 1) {
    // ---------- sole: carbon cage + foam midsole ----------
    float y = vUv.y;
    float hsT = 0.43 - 0.15 * sstep(0.2, 0.8, t);
    float ct = hsT + 0.015 + 0.2 * (1.0 - sstep(0.05, 0.36, t));
    float bot = 0.07 + 0.08 * sstep(0.25, 0.36, t) * (1.0 - sstep(0.47, 0.6, t));
    float cageLow = hsT - 0.07;
    float fwy = max(fwidth(y), 1e-5);
    float cage = smoothstep(cageLow - fwy, cageLow + fwy, y);
    // carbon twill on the cage
    float cw = carbon(vec2(t * 2.8, y) * 75.0);
    float cAA = 1.0 - smoothstep(0.3, 0.8, fwidth(t * 2.8 * 75.0));
    vec3 carbonCol = vec3(0.02, 0.022, 0.024) * (1.0 + (cw - 0.5) * 0.9 * cAA);
    // sculpted foam below: angular grooves
    float groove = aaLine(fract(t * 14.0 - y * 6.0) - 0.5, 0.03) * band(y, bot + 0.02, cageLow - 0.015);
    vec3 foam = vec3(0.03, 0.032, 0.035) * (1.0 - 0.3 * groove);
    albedo = mix(foam, carbonCol, cage);
    rough = mix(0.62, 0.26 + 0.12 * cw * cAA, cage);
    f0 = mix(0.04, 0.05, cage);
    // step shadow where the cage overhangs the foam
    albedo *= 1.0 - 0.5 * band(y, cageLow - 0.012, cageLow);
    // telemetry line tracing the cage rim — sweeps up the heel
    float rimLine = aaLine(y - (ct - 0.032), 0.0042) * band(t, 0.015, 0.985);
    emit += EMERALD_HOT * rimLine * 1.3;
    // secondary low line through the forefoot
    emit += EMERALD * aaLine(y - (bot + 0.032), 0.003) * sstep(0.55, 0.65, t) * band(t, 0.0, 0.97) * 0.8;
  } else if (uPart == 8) {
    // translucent emerald outsole pods
    albedo = vec3(0.01, 0.1, 0.065);
    rough = 0.25;
    f0 = 0.05;
    float NdVp = clamp(dot(N, V), 0.0, 1.0);
    emit += EMERALD * (0.22 + 0.5 * pow(1.0 - NdVp, 2.0)) * (0.55 + 0.45 * vUv.x);
  } else if (uPart == 9) {
    // glossy black TPU shell (heel bumper + clips)
    albedo = vec3(0.012, 0.013, 0.014);
    rough = 0.12;
    f0 = 0.06;
  } else if (uPart == 2) {
    albedo = vec3(0.02, 0.028, 0.025);
    rough = 0.9;
  } else if (uPart == 3) {
    vec2 p = vUv;
    float chev = step(0.5, fract(p.x * 7.0 + abs(p.y) * 5.0));
    albedo = mix(vec3(0.02, 0.022, 0.024), vec3(0.035, 0.04, 0.042), chev);
    rough = 0.5;
  } else if (uPart == 4) {
    albedo = vec3(0.055, 0.058, 0.06) * (0.85 + 0.15 * sin(vUv.x * 120.0));
    rough = 0.5;
  } else if (uPart == 5) {
    albedo = vec3(0.018, 0.019, 0.021);
    rough = 0.85;
  } else if (uPart == 6) {
    albedo = vec3(0.038, 0.04, 0.043) * (0.85 + 0.15 * sin(vUv.x * 300.0));
    rough = 0.85;
    float tag = band(vUv.x, 0.8, 0.93) * band(vUv.y, -0.38, 0.38);
    emit += EMERALD * tag * 1.4 * (0.75 + 0.25 * sin(uTime * 3.0));
    if (back) { albedo = vec3(0.018, 0.03, 0.026); emit *= 0.0; }
  } else {
    albedo = vec3(0.0);
    emit = EMERALD_HOT * 1.25;
    rough = 0.3;
  }

  // ---------- lighting ----------
  vec3 col = vec3(0.0);
  float NdV = clamp(dot(N, V), 0.0, 1.0);
  vec3 Ls[4];
  vec3 Cs[4];
  Ls[0] = normalize(vec3(-0.45, 0.85, 0.6));  Cs[0] = vec3(1.0, 0.97, 0.92) * 2.4;
  Ls[1] = normalize(vec3(0.7, 0.25, 0.8));    Cs[1] = vec3(0.7, 0.75, 0.8) * 0.45;
  Ls[2] = normalize(vec3(-0.9, 0.3, -0.7));   Cs[2] = EMERALD * 2.2;
  Ls[3] = normalize(vec3(0.95, 0.35, -0.6));  Cs[3] = CYAN * 1.0;
  float a = max(rough * rough, 0.03);
  float shin = 2.0 / (a * a) - 2.0;
  for (int i = 0; i < 4; i++) {
    vec3 L = Ls[i];
    float NdL = max(dot(N, L), 0.0);
    vec3 H = normalize(L + V);
    float NdH = max(dot(N, H), 0.0);
    float F = f0 + (1.0 - f0) * pow(1.0 - max(dot(V, H), 0.0), 5.0);
    float spec = (shin + 8.0) / 25.13 * pow(NdH, shin) * F;
    col += (albedo * 0.3183 + spec) * Cs[i] * NdL;
  }
  vec3 R = reflect(-V, N);
  float Fv = f0 + (1.0 - f0) * pow(1.0 - NdV, 5.0);
  col += env(R, rough) * Fv * mix(1.0, 0.12, rough);
  col += albedo * mix(vec3(0.02, 0.05, 0.04), vec3(0.12, 0.12, 0.13), N.y * 0.5 + 0.5);
  // emerald silhouette rim
  col += EMERALD * pow(1.0 - NdV, 4.0) * 0.14;
  col += emit;

  // telemetry scan sweep (model space, so it rides the shoe)
  if (uScan > -1.0) {
    float d = vLocal.y - uScan;
    float line = aaLine(d, 0.004);
    float trail = exp(-max(-d, 0.0) * 14.0) * step(d, 0.0) * 0.18;
    col += CYAN * (line * 1.6 + trail * 0.6);
  }

  col = aces(col * 1.1);
  col = pow(col, vec3(1.0 / 2.2));

  float alpha = 1.0;
  if (uMirror > 0.5) {
    alpha = 0.26 * (1.0 - smoothstep(0.0, 0.85, -vWorld.y));
  }
  outColor = vec4(col * alpha, alpha);
}
`

export const FLOOR_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aXZ;
uniform mat4 uViewProj;
out vec2 vP;
void main() {
  vP = aXZ;
  gl_Position = uViewProj * vec4(aXZ.x, 0.0, aXZ.y, 1.0);
}
`

export const FLOOR_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vP;
uniform float uYaw;
uniform float uTime;
uniform float uLift;
out vec4 outColor;
const vec3 EMERALD = vec3(0.063, 0.725, 0.506);
const vec3 CYAN = vec3(0.0, 0.94, 1.0);
float aaLine(float d, float w) {
  float fw = max(fwidth(d), 1e-5);
  return 1.0 - smoothstep(w - fw, w + fw, abs(d));
}
void main() {
  float r = length(vP);
  float ang = atan(vP.y, vP.x);
  // contact shadow aligned with the shoe's current heading
  float c = cos(uYaw), s = sin(uYaw);
  vec2 q = vec2(c * vP.x - s * vP.y, s * vP.x + c * vP.y);
  float spread = 1.0 + uLift * 1.5;
  float d = length(q / vec2(1.45 * spread, 0.42 * spread));
  float shadow = 0.78 * exp(-d * d * 2.6) / spread;

  float fade = 1.0 - smoothstep(1.4, 2.9, r);
  // HUD rings
  float ring1 = aaLine(r - 1.95, 0.004);
  float dash = step(0.45, fract(ang * 36.0 / 6.2832 + uTime * 0.12));
  float ring2 = aaLine(r - 2.12, 0.0025) * dash;
  float ticks = aaLine(r - 2.28, 0.025) * aaLine(fract(ang * 72.0 / 6.2832 - uTime * 0.05) - 0.5, 0.04);
  float sweep = pow(max(0.0, cos(ang - uTime * 0.9)), 24.0) * (1.0 - smoothstep(0.0, 1.95, r)) * 0.18;
  vec3 col = EMERALD * (ring1 * 0.7 + ring2 * 0.45 + ticks * 0.35) + CYAN * ring2 * 0.08;
  col += EMERALD * sweep;
  col += EMERALD * 0.05 * exp(-r * r * 0.9);
  col *= fade;
  outColor = vec4(col, shadow);
}
`
