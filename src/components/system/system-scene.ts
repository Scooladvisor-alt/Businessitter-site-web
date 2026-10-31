import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  LineSegments,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { createSystemData, SYSTEM_QUALITY, type SystemData } from "./system-data";

/**
 * Scène WebGL du « système » : nœuds lumineux, connexions et flux.
 * Rendu léger (points + lignes, shaders sur mesure), en pause dès qu'elle
 * n'est plus visible. Aucun calcul n'est effectué hors écran.
 */

export type SystemTargets = {
  /** 0 : chaos → 1 : système organisé. */
  morph: number;
  /** Proportion des connexions visibles. */
  connect: number;
  /** Intensité des flux qui parcourent les connexions. */
  flow: number;
  /** Opacité globale de la scène. */
  opacity: number;
  /** Avancée de la caméra (0 → 1). */
  dolly: number;
  /** Décalage horizontal du système (unités de scène). */
  offsetX: number;
  offsetY: number;
  scale: number;
};

export type SystemQuality = "high" | "low";

const BACKGROUND = new Color("#05060a");

const COMMON = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uAspect;

float morphFactor(float seed) {
  float m = smoothstep(seed * 0.45, seed * 0.45 + 0.55, uMorph);
  return m * m * (3.0 - 2.0 * m);
}

vec3 systemPosition(vec3 chaos, vec3 order, float seed, out float m) {
  m = morphFactor(seed);
  vec3 pos = mix(chaos, order, m);
  float drift = 1.0 - 0.78 * m;
  pos += vec3(
    sin(uTime * 0.31 + seed * 12.0),
    cos(uTime * 0.27 + seed * 7.0),
    sin(uTime * 0.23 + seed * 3.0)
  ) * 0.085 * drift;
  return pos;
}

vec4 pointerDisplace(vec4 clip, out float influence) {
  vec2 ndc = clip.xy / clip.w;
  vec2 diff = (ndc - uPointer) * vec2(uAspect, 1.0);
  float d = length(diff);
  influence = smoothstep(0.42, 0.0, d) * uPointerStrength;
  vec2 dir = d > 0.0001 ? diff / d : vec2(0.0);
  clip.xy += (dir / vec2(uAspect, 1.0)) * influence * 0.05 * clip.w;
  return clip;
}

vec3 palette(float t) {
  vec3 a = vec3(1.0, 0.784, 0.561);
  vec3 b = vec3(0.953, 0.663, 0.698);
  vec3 c = vec3(0.729, 0.710, 0.949);
  vec3 d = vec3(0.525, 0.902, 0.855);
  t = clamp(t, 0.0, 1.0);
  vec3 col = mix(a, b, smoothstep(0.0, 0.34, t));
  col = mix(col, c, smoothstep(0.33, 0.67, t));
  col = mix(col, d, smoothstep(0.66, 1.0, t));
  return col;
}
`;

const POINTS_VERTEX = /* glsl */ `
${COMMON}
attribute vec3 aChaos;
attribute vec3 aOrder;
attribute float aSize;
attribute float aSeed;
attribute vec2 aTone;
uniform float uPixelRatio;
uniform float uScale;
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
varying float vGlow;

void main() {
  float m;
  vec3 pos = systemPosition(aChaos, aOrder, aSeed, m);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float influence;
  gl_Position = pointerDisplace(projectionMatrix * mv, influence);
  float twinkle = 0.78 + 0.22 * sin(uTime * (0.7 + aSeed * 1.3) + aSeed * 40.0);
  gl_PointSize = aSize * uScale * uPixelRatio * (1.0 + influence * 0.7) / max(0.5, -mv.z);
  vColor = palette(mix(aTone.x, aTone.y, m));
  vAlpha = uOpacity * twinkle * smoothstep(-19.0, -5.5, mv.z);
  vGlow = influence;
}
`;

const POINTS_FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
varying float vGlow;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.12, 0.0, d);
  float halo = pow(smoothstep(0.5, 0.0, d), 2.6);
  vec3 col = mix(vColor, vec3(1.0, 0.985, 0.955), core * 0.8);
  float a = (halo * 0.7 + core) * vAlpha * (1.0 + vGlow * 0.9);
  gl_FragColor = vec4(col, a);
}
`;

const LINES_VERTEX = /* glsl */ `
${COMMON}
attribute vec3 aChaos;
attribute vec3 aOrder;
attribute float aSeed;
attribute float aT;
attribute vec2 aEdge;
attribute vec2 aTone;
uniform float uConnect;
uniform float uOpacity;
uniform float uVisibility;
varying float vT;
varying float vAlpha;
varying float vEdgeSeed;
varying vec3 vColor;

void main() {
  float m;
  vec3 pos = systemPosition(aChaos, aOrder, aSeed, m);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float influence;
  gl_Position = pointerDisplace(projectionMatrix * mv, influence);
  vT = aT;
  vEdgeSeed = aEdge.x;
  float reveal = smoothstep(aEdge.y - 0.14, aEdge.y, uConnect);
  vAlpha = reveal * uOpacity * uVisibility * smoothstep(-19.0, -5.5, mv.z) * (1.0 + influence);
  vColor = palette(mix(aTone.x, aTone.y, m));
}
`;

const LINES_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uFlow;
uniform float uBase;
uniform float uFlowShare;
varying float vT;
varying float vAlpha;
varying float vEdgeSeed;
varying vec3 vColor;

void main() {
  float carrier = step(1.0 - uFlowShare, vEdgeSeed);
  float speed = 0.14 + vEdgeSeed * 0.22;
  float p = fract(uTime * speed + vEdgeSeed * 9.73);
  float pulse = smoothstep(0.085, 0.0, abs(vT - p)) * uFlow * carrier;
  float a = (uBase + pulse * 0.9) * vAlpha;
  vec3 col = mix(vColor, vec3(1.0), pulse * 0.55);
  gl_FragColor = vec4(col, a);
}
`;

function nodeAttributes(geometry: BufferGeometry, data: SystemData) {
  geometry.setAttribute("position", new BufferAttribute(data.chaos, 3));
  geometry.setAttribute("aChaos", new BufferAttribute(data.chaos, 3));
  geometry.setAttribute("aOrder", new BufferAttribute(data.order, 3));
  geometry.setAttribute("aSize", new BufferAttribute(data.size, 1));
  geometry.setAttribute("aSeed", new BufferAttribute(data.seed, 1));
  geometry.setAttribute("aTone", new BufferAttribute(data.tone, 2));
}

function edgeGeometry(data: SystemData, edges: Uint16Array, seedOffset: number) {
  const vertexCount = edges.length;
  const chaos = new Float32Array(vertexCount * 3);
  const order = new Float32Array(vertexCount * 3);
  const seed = new Float32Array(vertexCount);
  const t = new Float32Array(vertexCount);
  const edge = new Float32Array(vertexCount * 2);
  const tone = new Float32Array(vertexCount * 2);

  let hash = 0.618 + seedOffset;
  for (let e = 0; e < edges.length; e += 2) {
    hash = (hash + 0.618033988749895) % 1;
    const edgeSeed = (hash * 7.13) % 1;
    const reveal = 0.08 + ((hash * 3.71) % 1) * 0.9;
    for (let side = 0; side < 2; side++) {
      const node = edges[e + side] as number;
      const v = e + side;
      chaos.set(data.chaos.subarray(node * 3, node * 3 + 3), v * 3);
      order.set(data.order.subarray(node * 3, node * 3 + 3), v * 3);
      seed[v] = data.seed[node] as number;
      t[v] = side;
      edge[v * 2] = edgeSeed;
      edge[v * 2 + 1] = reveal;
      tone[v * 2] = data.tone[node * 2] as number;
      tone[v * 2 + 1] = data.tone[node * 2 + 1] as number;
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(chaos, 3));
  geometry.setAttribute("aChaos", new BufferAttribute(chaos, 3));
  geometry.setAttribute("aOrder", new BufferAttribute(order, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seed, 1));
  geometry.setAttribute("aT", new BufferAttribute(t, 1));
  geometry.setAttribute("aEdge", new BufferAttribute(edge, 2));
  geometry.setAttribute("aTone", new BufferAttribute(tone, 2));
  return geometry;
}

type SharedUniforms = {
  uTime: { value: number };
  uMorph: { value: number };
  uPointer: { value: [number, number] };
  uPointerStrength: { value: number };
  uAspect: { value: number };
};

export class SystemScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(38, 1, 0.1, 60);
  private group = new Group();
  private points: Points;
  private chaosLines: LineSegments;
  private orderLines: LineSegments;
  private shared: SharedUniforms;
  private pointsMaterial: ShaderMaterial;
  private chaosMaterial: ShaderMaterial;
  private orderMaterial: ShaderMaterial;

  private raf = 0;
  private running = false;
  private disposed = false;
  private last = 0;
  private time = 0;
  private pixelRatio = 1;

  private pointerTarget: [number, number] = [0, 0];
  private pointer: [number, number] = [0, 0];
  private pointerActive = 0;
  private pointerActiveTarget = 0;

  private targets: SystemTargets = {
    morph: 0,
    connect: 0.2,
    flow: 0,
    opacity: 0,
    dolly: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  };
  private current: SystemTargets = { ...this.targets };

  /** Appelé lorsque le contexte WebGL est perdu. */
  onContextLost: (() => void) | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private quality: SystemQuality,
  ) {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: quality === "high" && window.devicePixelRatio < 2,
      alpha: false,
      powerPreference: quality === "high" ? "high-performance" : "low-power",
      stencil: false,
      depth: false,
    });
    this.renderer.setClearColor(BACKGROUND, 1);

    const data = createSystemData(SYSTEM_QUALITY[quality]);

    this.shared = {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uPointer: { value: [0, 0] },
      uPointerStrength: { value: 0 },
      uAspect: { value: 1 },
    };

    const pointsGeometry = new BufferGeometry();
    nodeAttributes(pointsGeometry, data);
    this.pointsMaterial = new ShaderMaterial({
      vertexShader: POINTS_VERTEX,
      fragmentShader: POINTS_FRAGMENT,
      uniforms: {
        ...this.shared,
        uPixelRatio: { value: 1 },
        uScale: { value: quality === "high" ? 64 : 70 },
        uOpacity: { value: 1 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.points = new Points(pointsGeometry, this.pointsMaterial);
    this.points.frustumCulled = false;

    const lineMaterial = (base: number, flowShare: number) =>
      new ShaderMaterial({
        vertexShader: LINES_VERTEX,
        fragmentShader: LINES_FRAGMENT,
        uniforms: {
          ...this.shared,
          uConnect: { value: 0 },
          uOpacity: { value: 1 },
          uVisibility: { value: 1 },
          uFlow: { value: 0 },
          uBase: { value: base },
          uFlowShare: { value: flowShare },
        },
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: AdditiveBlending,
      });

    this.chaosMaterial = lineMaterial(0.17, 0.32);
    this.orderMaterial = lineMaterial(0.24, 0.62);
    this.chaosLines = new LineSegments(
      edgeGeometry(data, data.chaosEdges, 0.1),
      this.chaosMaterial,
    );
    this.orderLines = new LineSegments(
      edgeGeometry(data, data.orderEdges, 0.37),
      this.orderMaterial,
    );
    this.chaosLines.frustumCulled = false;
    this.orderLines.frustumCulled = false;

    this.group.add(this.chaosLines, this.orderLines, this.points);
    this.group.rotation.set(0.12, -0.35, 0);
    this.scene.add(this.group);
    this.camera.position.set(0, 0, 10.5);

    canvas.addEventListener("webglcontextlost", this.handleContextLost, false);
    this.resize();
  }

  private handleContextLost = (event: Event) => {
    event.preventDefault();
    this.stop();
    this.onContextLost?.();
  };

  /** Opacité actuellement rendue (après lissage). */
  get currentOpacity(): number {
    return this.current.opacity;
  }

  setTargets(targets: Partial<SystemTargets>, immediate = false) {
    Object.assign(this.targets, targets);
    if (immediate) Object.assign(this.current, targets);
    if (this.targets.opacity > 0.001) this.start();
  }

  /** Position du pointeur en coordonnées normalisées (-1 → 1). */
  setPointer(x: number, y: number) {
    this.pointerTarget = [x, y];
    this.pointerActiveTarget = 1;
  }

  releasePointer() {
    this.pointerActiveTarget = 0;
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    const cap = this.quality === "high" ? 2 : 1.5;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, cap);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.shared.uAspect.value = this.camera.aspect;
    this.pointsMaterial.uniforms.uPixelRatio.value = this.pixelRatio;
    if (!this.running) this.render();
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    this.raf = requestAnimationFrame(this.frame);
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    this.time += dt;

    const ease = 1 - Math.exp(-dt * 4.2);
    const c = this.current;
    const t = this.targets;
    (Object.keys(t) as (keyof SystemTargets)[]).forEach((key) => {
      c[key] += (t[key] - c[key]) * ease;
    });

    const pEase = 1 - Math.exp(-dt * 3.2);
    this.pointer[0] += (this.pointerTarget[0] - this.pointer[0]) * pEase;
    this.pointer[1] += (this.pointerTarget[1] - this.pointer[1]) * pEase;
    this.pointerActive += (this.pointerActiveTarget - this.pointerActive) * pEase;

    this.render();

    if (t.opacity <= 0.001 && c.opacity < 0.004) {
      c.opacity = 0;
      this.render();
      this.stop();
    }
  };

  private render() {
    const c = this.current;
    this.shared.uTime.value = this.time;
    this.shared.uMorph.value = c.morph;
    this.shared.uPointer.value = this.pointer;
    this.shared.uPointerStrength.value = this.pointerActive;

    this.pointsMaterial.uniforms.uOpacity.value = c.opacity;
    const chaosVisibility = 1 - smoothstep(0.25, 0.85, c.morph);
    const orderVisibility = smoothstep(0.35, 0.95, c.morph);
    for (const [material, visibility] of [
      [this.chaosMaterial, chaosVisibility],
      [this.orderMaterial, orderVisibility],
    ] as const) {
      material.uniforms.uOpacity.value = c.opacity;
      material.uniforms.uVisibility.value = visibility;
      material.uniforms.uConnect.value =
        material === this.orderMaterial ? Math.max(c.connect, orderVisibility) : c.connect;
      material.uniforms.uFlow.value = c.flow;
    }
    this.chaosLines.visible = chaosVisibility > 0.002;
    this.orderLines.visible = orderVisibility > 0.002;

    // Rotation lente, inclinaison selon le pointeur, avancée de caméra.
    this.group.rotation.y =
      -0.35 + this.time * (0.035 + c.morph * 0.03) + this.pointer[0] * 0.12 * this.pointerActive;
    this.group.rotation.x = 0.12 - this.pointer[1] * 0.08 * this.pointerActive;
    this.group.position.set(c.offsetX, c.offsetY, 0);
    this.group.scale.setScalar(c.scale);
    this.camera.position.z = 10.5 - c.dolly * 2.4;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    this.canvas.removeEventListener("webglcontextlost", this.handleContextLost);
    this.points.geometry.dispose();
    this.chaosLines.geometry.dispose();
    this.orderLines.geometry.dispose();
    this.pointsMaterial.dispose();
    this.chaosMaterial.dispose();
    this.orderMaterial.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
