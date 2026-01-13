declare module "canvas-confetti" {
  export type Options = {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    decay?: number;
    scalar?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
  };

  export default function confetti(options?: Options): void;
}
