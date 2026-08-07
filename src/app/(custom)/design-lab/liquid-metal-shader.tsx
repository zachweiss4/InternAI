'use client';

import { useEffect, useRef } from 'react';

interface LiquidMetalShaderProps {
  className?: string;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;
  uniform float u_scroll;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 turn = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = turn * p * 2.08 + 9.17;
      amplitude *= 0.52;
    }
    return value;
  }

  float metalField(vec2 p, float time) {
    vec2 drift = vec2(time * 0.22, -time * 0.17);
    float broad = fbm(p * 0.86 + drift);
    vec2 warp = vec2(
      fbm(p * 1.34 + vec2(broad * 1.8, time * 0.13)),
      fbm(p * 1.21 + vec2(-time * 0.16, broad * 1.6))
    );
    vec2 q = p + (warp - 0.5) * 1.18;
    float fluid = fbm(q * 1.72 - drift * 0.74);
    float ribbonA = sin(q.x * 3.6 + q.y * 1.35 + fluid * 6.4 - time * 0.72);
    float ribbonB = cos(q.y * 4.1 - q.x * 0.82 + broad * 5.2 + time * 0.56);
    return fluid * 0.58 + (ribbonA + ribbonB) * 0.105 + broad * 0.23;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / max(u_resolution.y, 1.0);

    float time = u_time * 0.52 + u_scroll * 0.00018;
    vec2 pointer = (u_pointer * 2.0 - 1.0) * vec2(1.0, -1.0);
    pointer.x *= u_resolution.x / max(u_resolution.y, 1.0);

    float surface = metalField(p, time);
    float epsilon = 2.2 / max(u_resolution.y, 1.0);
    float dx = metalField(p + vec2(epsilon, 0.0), time) - surface;
    float dy = metalField(p + vec2(0.0, epsilon), time) - surface;
    vec3 normal = normalize(vec3(-dx * 32.0, -dy * 32.0, 1.0));

    vec3 viewDirection = vec3(0.0, 0.0, 1.0);
    vec3 lightDirection = normalize(vec3(-0.42, 0.56, 0.72));
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float specular = pow(max(dot(reflect(-lightDirection, normal), viewDirection), 0.0), 54.0);
    float rim = pow(1.0 - max(normal.z, 0.0), 2.4);
    float band = 0.5 + 0.5 * sin(surface * 24.0 + normal.x * 4.0 + time * 0.34);

    vec3 ink = vec3(0.008, 0.011, 0.022);
    vec3 graphite = vec3(0.12, 0.15, 0.22);
    vec3 silver = vec3(0.78, 0.86, 0.96);
    vec3 whiteChrome = vec3(0.97, 0.985, 1.0);
    vec3 cyan = vec3(0.05, 0.78, 0.94);
    vec3 violet = vec3(0.48, 0.25, 0.95);

    vec3 environment = mix(violet, cyan, smoothstep(-0.65, 0.72, normal.y + normal.x * 0.35));
    vec3 color = mix(ink, graphite, smoothstep(0.18, 0.75, surface));
    color = mix(color, silver, diffuse * 0.58 + band * 0.18);
    color += whiteChrome * specular * 1.35;
    color += environment * (rim * 0.72 + abs(normal.x) * 0.12);

    float pointerDistance = dot(p - pointer, p - pointer);
    float pointerGlow = 0.12 / (0.12 + pointerDistance);
    float pointerRing = exp(-abs(sqrt(pointerDistance) - 0.32) * 22.0);
    color += mix(cyan, whiteChrome, 0.55) * pointerGlow * 0.22;
    color += violet * pointerRing * 0.12;

    float travellingHighlight = pow(
      max(0.0, 1.0 - abs(p.x * 0.28 + p.y - sin(time * 0.38) * 0.68)),
      16.0
    );
    color += whiteChrome * travellingHighlight * 0.34;

    float vignette = smoothstep(1.58, 0.24, length(p * vec2(0.56, 0.82)));
    color *= 0.48 + vignette * 0.7;
    color = pow(color, vec3(0.92));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function LiquidMetalShader({ className }: LiquidMetalShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!gl) return;

    const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertex || !fragment) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram is not a React hook.
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolutionUniform = gl.getUniformLocation(program, 'u_resolution');
    const pointerUniform = gl.getUniformLocation(program, 'u_pointer');
    const timeUniform = gl.getUniformLocation(program, 'u_time');
    const scrollUniform = gl.getUniformLocation(program, 'u_scroll');
    const pointer = { x: 0.68, y: 0.32 };
    const startedAt = performance.now();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const updatePointer = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / Math.max(bounds.width, 1);
      pointer.y = (event.clientY - bounds.top) / Math.max(bounds.height, 1);
    };

    const draw = (now: number) => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * pixelRatio));
      const height = Math.max(1, Math.round(bounds.height * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      gl.uniform2f(resolutionUniform, width, height);
      gl.uniform2f(pointerUniform, pointer.x, pointer.y);
      gl.uniform1f(timeUniform, (now - startedAt) / 1000);
      gl.uniform1f(scrollUniform, window.scrollY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', updatePointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}
