// src/components/DecimalGrid.jsx
// Renders a tenths strip (1×10) or a hundredths grid (10×10).
//
// Two modes:
//  - Display (default): shades the first `shaded` cells — the canonical
//    concrete visual for fraction/decimal equivalence in question visuals.
//  - Interactive (`interactive` + `onToggle`): cells become tappable
//    buttons and shading is driven by the `shadedIndices` Set instead,
//    used by the Grid Shader Simulate station.
export default function DecimalGrid({
  mode = 'tenths',
  shaded = 0,
  shadedIndices = null,
  compact = false,
  interactive = false,
  onToggle,
}) {
  const total = mode === 'tenths' ? 10 : 100;
  const isShadedAt = (i) => (shadedIndices ? shadedIndices.has(i) : i < shaded);

  return (
    <div
      className={`decimal-grid decimal-grid-${mode}${compact ? ' compact' : ''}${interactive ? ' interactive' : ''}`}
      role={interactive ? undefined : 'img'}
      aria-label={interactive ? undefined : `${shaded} out of ${total} shaded`}
    >
      {Array.from({ length: total }, (_, i) => (
        interactive ? (
          <button
            key={i}
            type="button"
            className={`decimal-cell${isShadedAt(i) ? ' shaded' : ''}`}
            onClick={() => onToggle?.(i)}
            aria-label={`cell ${i + 1}${isShadedAt(i) ? ' shaded' : ' empty'}`}
          />
        ) : (
          <span key={i} className={`decimal-cell${isShadedAt(i) ? ' shaded' : ''}`} />
        )
      ))}
    </div>
  );
}
