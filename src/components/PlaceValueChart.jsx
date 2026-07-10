// src/components/PlaceValueChart.jsx
import React from 'react';

// Ones | . | Tenths | Hundredths place-value table, highlighting one column.
export default function PlaceValueChart({ whole = 0, tenths = 0, hundredths = 0, highlight = null }) {
  const cols = [
    { key: 'ones', label: 'Ones', value: whole },
    { key: 'tenths', label: 'Tenths', value: tenths },
    { key: 'hundredths', label: 'Hundredths', value: hundredths },
  ];
  return (
    <div className="place-value-chart" role="img" aria-label={`${whole}.${tenths}${hundredths}`}>
      {cols.map((c, i) => (
        <React.Fragment key={c.key}>
          {i === 1 && <div className="pv-decimal-point">.</div>}
          <div className={`pv-column${highlight === c.key ? ' pv-highlight' : ''}`}>
            <div className="pv-digit">{c.value}</div>
            <div className="pv-label">{c.label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
