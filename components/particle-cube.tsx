"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  type AnimationPlaybackControls,
  type Transition,
} from "framer-motion";

type Shell = {
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  count: number;
};

type Vec3 = { x: number; y: number; z: number };
type Move = { axis: number; layer: number; dir: number };

type Config = {
  color: string;
  cubeGrid: number;
  dotsPerFace: number;
  dotSize: number;
  rotation: Vec3;
  transition: Transition;
  sizePercent: number;
  dragSensitivity: number;
};

function latticeCoord(index: number, count: number) {
  return count <= 1 ? 0 : -1 + (2 * index) / (count - 1);
}

function snapCoord(coordinate: number, count: number) {
  if (count <= 1) return 0;
  const index = Math.round(((coordinate + 1) / 2) * (count - 1));
  return latticeCoord(Math.max(0, Math.min(count - 1, index)), count);
}

function buildShell(cubeGrid: number, dotsPerFace: number): Shell {
  const totalPoints = Math.max(
    2,
    (cubeGrid - 1) * Math.max(1, dotsPerFace) + 1,
  );
  const x: number[] = [];
  const y: number[] = [];
  const z: number[] = [];

  for (let i = 0; i < totalPoints; i++) {
    for (let j = 0; j < totalPoints; j++) {
      for (let k = 0; k < totalPoints; k++) {
        const onShell =
          i === 0 ||
          i === totalPoints - 1 ||
          j === 0 ||
          j === totalPoints - 1 ||
          k === 0 ||
          k === totalPoints - 1;
        if (!onShell) continue;
        x.push(latticeCoord(i, totalPoints));
        y.push(latticeCoord(j, totalPoints));
        z.push(latticeCoord(k, totalPoints));
      }
    }
  }

  return {
    x: Float32Array.from(x),
    y: Float32Array.from(y),
    z: Float32Array.from(z),
    count: x.length,
  };
}

function bandOf(coordinate: number, cubeGrid: number) {
  const band = Math.floor(((coordinate + 1) / 2) * cubeGrid);
  return Math.max(0, Math.min(cubeGrid - 1, band));
}

function rotateAxis(
  x: number,
  y: number,
  z: number,
  axis: number,
  cosine: number,
  sine: number,
  output: Vec3,
) {
  if (axis === 0) {
    output.x = x;
    output.y = y * cosine - z * sine;
    output.z = y * sine + z * cosine;
  } else if (axis === 1) {
    output.x = x * cosine + z * sine;
    output.y = y;
    output.z = -x * sine + z * cosine;
  } else {
    output.x = x * cosine - y * sine;
    output.y = x * sine + y * cosine;
    output.z = z;
  }
}

function clampSpin(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(-12, Math.min(12, value));
}

const HALF_DIAGONAL = Math.sqrt(3);

class ParticleCubeScene {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private config: Config;
  private shell: Shell;
  private x!: Float32Array;
  private y!: Float32Array;
  private z!: Float32Array;
  private depth!: Float32Array;
  private order!: Int32Array;
  private projectedX!: Float32Array;
  private projectedY!: Float32Array;
  private memberFlag!: Uint8Array;
  private turn: Move | null = null;
  private turnTarget = 0;
  private turnProgress = 0;
  private turnControls: AnimationPlaybackControls | null = null;
  private turnMembers: number[] = [];
  private lastMove: Move | null = null;
  private angleX = 0.5;
  private angleY = 0.6;
  private angleZ = 0;
  private dragging = false;
  private pointerX = 0;
  private pointerY = 0;
  private frameId = 0;
  private lastTime = 0;
  private disposed = false;
  private dpr = 1;
  private width = 1;
  private height = 1;
  private temporary: Vec3 = { x: 0, y: 0, z: 0 };

  private onPointerDown = (event: PointerEvent) => {
    this.dragging = true;
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    this.canvas.style.cursor = "grabbing";
  };

  private onPointerMove = (event: PointerEvent) => {
    if (!this.dragging) return;
    const deltaX = event.clientX - this.pointerX;
    const deltaY = event.clientY - this.pointerY;
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    const sensitivity = (this.config.dragSensitivity || 1) * 0.008;
    this.angleY += deltaX * sensitivity;
    this.angleX += deltaY * sensitivity;
  };

  private onPointerUp = () => {
    this.dragging = false;
    this.canvas.style.cursor = "grab";
  };

  constructor(
    private container: HTMLElement,
    config: Config,
  ) {
    this.config = config;
    this.canvas = document.createElement("canvas");
    Object.assign(this.canvas.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      cursor: "grab",
      touchAction: "none",
    });
    container.appendChild(this.canvas);
    const context = this.canvas.getContext("2d");
    if (!context) throw new Error("2D context unavailable");
    this.context = context;
    this.shell = buildShell(this.grid(config.cubeGrid), this.dots(config.dotsPerFace));
    this.adoptShell();
    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    this.canvas.addEventListener("pointerleave", this.onPointerUp);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
  }

  private grid(value: number) {
    return Math.max(2, Math.min(8, Math.round(value)));
  }

  private dots(value: number) {
    return Math.max(1, Math.min(8, Math.round(value)));
  }

  private totalPoints() {
    return Math.max(
      2,
      (this.grid(this.config.cubeGrid) - 1) *
        this.dots(this.config.dotsPerFace) +
        1,
    );
  }

  private adoptShell() {
    this.x = Float32Array.from(this.shell.x);
    this.y = Float32Array.from(this.shell.y);
    this.z = Float32Array.from(this.shell.z);
    this.depth = new Float32Array(this.shell.count);
    this.order = new Int32Array(this.shell.count);
    this.projectedX = new Float32Array(this.shell.count);
    this.projectedY = new Float32Array(this.shell.count);
    this.memberFlag = new Uint8Array(this.shell.count);
    for (let index = 0; index < this.shell.count; index++) {
      this.order[index] = index;
    }
    this.turnControls?.stop();
    this.turnControls = null;
    this.turn = null;
    this.turnMembers = [];
    this.turnProgress = 0;
  }

  start() {
    this.lastTime = performance.now();
    const loop = () => {
      this.frameId = requestAnimationFrame(loop);
      this.step();
    };
    loop();
  }

  setSize(width: number, height: number) {
    if (this.disposed || width <= 0 || height <= 0) return;
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.max(1, Math.floor(width * this.dpr));
    this.canvas.height = Math.max(1, Math.floor(height * this.dpr));
  }

  updateConfig(config: Config) {
    if (this.disposed) return;
    const rebuild =
      this.grid(config.cubeGrid) !== this.grid(this.config.cubeGrid) ||
      this.dots(config.dotsPerFace) !== this.dots(this.config.dotsPerFace);
    this.config = config;
    if (rebuild) {
      this.shell = buildShell(
        this.grid(config.cubeGrid),
        this.dots(config.dotsPerFace),
      );
      this.adoptShell();
    }
  }

  private pickMove() {
    const grid = this.grid(this.config.cubeGrid);
    let move: Move;
    let attempts = 0;
    do {
      move = {
        axis: Math.floor(Math.random() * 3),
        layer: Math.floor(Math.random() * grid),
        dir: Math.random() < 0.5 ? 1 : -1,
      };
      attempts++;
    } while (
      attempts < 8 &&
      this.lastMove &&
      move.axis === this.lastMove.axis &&
      move.layer === this.lastMove.layer &&
      move.dir === -this.lastMove.dir
    );

    const coordinates = move.axis === 0 ? this.x : move.axis === 1 ? this.y : this.z;
    this.memberFlag.fill(0);
    this.turnMembers = [];
    for (let index = 0; index < this.shell.count; index++) {
      if (bandOf(coordinates[index], grid) === move.layer) {
        this.turnMembers.push(index);
        this.memberFlag[index] = 1;
      }
    }

    this.turn = move;
    this.turnProgress = 0;
    this.turnTarget = (move.dir * Math.PI) / 2;
    this.lastMove = move;
    this.turnControls = animate(0, 1, {
      ...this.config.transition,
      onUpdate: (value) => {
        this.turnProgress = value;
      },
      onComplete: () => {
        this.commitTurn();
        this.turnControls = null;
      },
    });
  }

  private commitTurn() {
    if (!this.turn) return;
    const count = this.totalPoints();
    const cosine = Math.cos(this.turnTarget);
    const sine = Math.sin(this.turnTarget);
    for (const index of this.turnMembers) {
      rotateAxis(
        this.x[index],
        this.y[index],
        this.z[index],
        this.turn.axis,
        cosine,
        sine,
        this.temporary,
      );
      this.x[index] = snapCoord(this.temporary.x, count);
      this.y[index] = snapCoord(this.temporary.y, count);
      this.z[index] = snapCoord(this.temporary.z, count);
    }
    this.memberFlag.fill(0);
    this.turn = null;
    this.turnMembers = [];
  }

  private step() {
    if (this.disposed) return;
    const now = performance.now();
    let delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (!Number.isFinite(delta) || delta < 0) delta = 0;
    if (delta > 0.05) delta = 0.05;

    if (!this.dragging) {
      this.angleX += clampSpin(this.config.rotation.x) * 0.06 * delta;
      this.angleY += clampSpin(this.config.rotation.y) * 0.06 * delta;
      this.angleZ += clampSpin(this.config.rotation.z) * 0.06 * delta;
    }
    if (!this.turn && !this.turnControls) this.pickMove();
    this.render();
  }

  private render() {
    const context = this.context;
    context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    context.clearRect(0, 0, this.width, this.height);

    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const sizePercent = Math.max(20, Math.min(200, this.config.sizePercent));
    const scale = Math.min(this.width, this.height) * 0.26 * (sizePercent / 100);
    const cosX = Math.cos(this.angleX);
    const sinX = Math.sin(this.angleX);
    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);
    const cosZ = Math.cos(this.angleZ);
    const sinZ = Math.sin(this.angleZ);
    const turnAngle = this.turnTarget * this.turnProgress;
    const turnCosine = this.turn ? Math.cos(turnAngle) : 1;
    const turnSine = this.turn ? Math.sin(turnAngle) : 0;

    for (let index = 0; index < this.shell.count; index++) {
      let x = this.x[index];
      let y = this.y[index];
      let z = this.z[index];
      if (this.turn && this.memberFlag[index]) {
        rotateAxis(
          x,
          y,
          z,
          this.turn.axis,
          turnCosine,
          turnSine,
          this.temporary,
        );
        x = this.temporary.x;
        y = this.temporary.y;
        z = this.temporary.z;
      }

      const rotatedY = y * cosX - z * sinX;
      const rotatedZ = y * sinX + z * cosX;
      const rotatedX2 = x * cosY + rotatedZ * sinY;
      const depth = -x * sinY + rotatedZ * cosY;
      const rotatedX3 = rotatedX2 * cosZ - rotatedY * sinZ;
      const rotatedY3 = rotatedX2 * sinZ + rotatedY * cosZ;
      const perspective = 1 + depth * 0.16;

      this.depth[index] = depth;
      this.projectedX[index] = centerX + rotatedX3 * scale * perspective;
      this.projectedY[index] = centerY - rotatedY3 * scale * perspective;
    }

    this.order.sort((a, b) => this.depth[a] - this.depth[b]);
    context.globalCompositeOperation = "lighter";
    context.fillStyle = this.config.color || "#ffffff";
    const dotSize = Math.max(1, Math.min(6, Math.round(this.config.dotSize)));

    for (let position = 0; position < this.shell.count; position++) {
      const index = this.order[position];
      const depthRatio = Math.max(
        0,
        Math.min(
          1,
          (this.depth[index] + HALF_DIAGONAL) / (2 * HALF_DIAGONAL),
        ),
      );
      context.globalAlpha = 0.22 + 0.78 * depthRatio;
      const radius = Math.max(0.4, dotSize * (0.5 + 0.7 * depthRatio));
      context.beginPath();
      context.arc(
        this.projectedX[index],
        this.projectedY[index],
        radius,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
    context.globalAlpha = 1;
    context.globalCompositeOperation = "source-over";
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    this.turnControls?.stop();
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    this.canvas.removeEventListener("pointerleave", this.onPointerUp);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    if (this.canvas.parentNode === this.container) {
      this.container.removeChild(this.canvas);
    }
  }
}

type ParticleCubeProps = {
  color?: string;
  cubeGrid?: number;
  dotsPerFace?: number;
  dotSize?: number;
  rotation?: Vec3;
  transition?: Transition;
  sizePercent?: number;
  dragSensitivity?: number;
  style?: React.CSSProperties;
};

const DEFAULT_ROTATION = { x: 2, y: 5, z: 0 };
const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 1,
};

export default function ParticleCube({
  color = "#ffffff",
  cubeGrid = 3,
  dotsPerFace = 4,
  dotSize = 2,
  rotation = DEFAULT_ROTATION,
  transition = DEFAULT_TRANSITION,
  sizePercent = 100,
  dragSensitivity = 1,
  style,
}: ParticleCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ParticleCubeScene | null>(null);
  const configRef = useRef<Config>({
    color,
    cubeGrid,
    dotsPerFace,
    dotSize,
    rotation,
    transition,
    sizePercent,
    dragSensitivity,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let scene: ParticleCubeScene | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      if (!scene && !cancelled) {
        scene = new ParticleCubeScene(container, configRef.current);
        sceneRef.current = scene;
        scene.setSize(rect.width, rect.height);
        scene.start();
      } else {
        scene?.setSize(rect.width, rect.height);
      }
    });
    resizeObserver.observe(container);
    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    const config = {
      color,
      cubeGrid,
      dotsPerFace,
      dotSize,
      rotation,
      transition,
      sizePercent,
      dragSensitivity,
    };
    configRef.current = config;
    sceneRef.current?.updateConfig(config);
  }, [
    color,
    cubeGrid,
    dotsPerFace,
    dotSize,
    rotation,
    transition,
    sizePercent,
    dragSensitivity,
  ]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="회전하는 파티클 큐브"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 200,
        minHeight: 200,
        overflow: "hidden",
        ...style,
      }}
    />
  );
}
