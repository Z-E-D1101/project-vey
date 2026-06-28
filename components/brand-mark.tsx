/**
 * Mneme brand mark — an abstract "memory node" glyph rendered with Primer
 * accent tokens. Decorative; labelled by surrounding text.
 */
export function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 'var(--borderRadius-medium)',
        background:
          'linear-gradient(135deg, var(--fgColor-accent), var(--fgColor-done, #a371f7))',
        boxShadow: '0 0 0 1px var(--borderColor-accent-muted)',
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="5" r="2.4" fill="white" />
        <circle cx="5" cy="17" r="2.4" fill="white" />
        <circle cx="19" cy="17" r="2.4" fill="white" />
        <path
          d="M12 5L5 17M12 5l7 12M5 17h14"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </span>
  )
}
