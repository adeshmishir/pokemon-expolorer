export default function PokedexBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{
        background: `
          linear-gradient(
            135deg,
            #2a2a2a 0%,
            #2a2a2a 18%,
            #2e2e2e 18%,
            #2e2e2e 32%,
            #272727 32%,
            #272727 48%,
            #2c2c2c 48%,
            #2c2c2c 62%,
            #292929 62%,
            #292929 78%,
            #2d2d2d 78%,
            #2d2d2d 90%,
            #282828 90%
          )
        `,
      }}
    >
      {/* Very subtle secondary diagonal overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(255,255,255,0.02) 0%,
              transparent 25%,
              rgba(255,255,255,0.015) 25%,
              transparent 50%,
              rgba(255,255,255,0.02) 50%,
              transparent 75%,
              rgba(255,255,255,0.01) 75%
            )
          `,
        }}
      />
    </div>
  );
}
