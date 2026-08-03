import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { TIERS } from '../../theme/brand';

// Visual metadata per badge tier. Kept in sync with backend
// config/certificateConfig.js (badgeTier keys: distinction | merit | pass).
export const TIER_META = {
  distinction: { label: 'Distinction', medal: 'Gold', ...TIERS.distinction },
  merit: { label: 'Merit', medal: 'Silver', ...TIERS.merit },
  pass: { label: 'Certified Pass', medal: 'Bronze', ...TIERS.pass },
};

// A self-contained SVG achievement medal. `size` controls diameter in px.
// Used both in the certificate and standalone in the badges gallery.
const CertificateBadge = ({ tier = 'pass', percentage, size = 120, showLabel = true }) => {
  const meta = TIER_META[tier] || TIER_META.pass;
  const r = size / 2;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={0.75}>
      <svg
        width={size}
        height={size * 1.28}
        viewBox="0 0 100 128"
        role="img"
        aria-label={`${meta.label} badge`}
      >
        {/* Ribbons */}
        <polygon points="34,78 22,124 40,112 50,124 50,84" fill={meta.ringDark} />
        <polygon points="66,78 78,124 60,112 50,124 50,84" fill={meta.ring} />
        {/* Outer ring */}
        <circle cx="50" cy="46" r="42" fill={meta.ringDark} />
        <circle cx="50" cy="46" r="38" fill={meta.ring} />
        {/* Fluted edge dots */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={50 + Math.cos(a) * 38}
              cy={46 + Math.sin(a) * 38}
              r="1.6"
              fill={meta.ringDark}
            />
          );
        })}
        {/* Face */}
        <circle cx="50" cy="46" r="30" fill={meta.face} />
        <circle cx="50" cy="46" r="30" fill="none" stroke={meta.ringDark} strokeWidth="1" />
        {/* Star */}
        <polygon
          points="50,26 55.9,41.1 72,42 59.2,52.2 63.5,68 50,58.8 36.5,68 40.8,52.2 28,42 44.1,41.1"
          fill={meta.ringDark}
          opacity="0.35"
        />
        {/* Percentage */}
        <text
          x="50"
          y="50"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill={meta.text}
          fontFamily="Georgia, serif"
        >
          {percentage != null ? `${Math.round(percentage)}%` : meta.medal}
        </text>
      </svg>
      {showLabel && (
        <Box textAlign="center" lineHeight={1.1}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: meta.text }}>
            {meta.label}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {meta.medal} Badge
          </Typography>
        </Box>
      )}
    </Box>
  );
};

CertificateBadge.propTypes = {
  tier: PropTypes.oneOf(['distinction', 'merit', 'pass']),
  percentage: PropTypes.number,
  size: PropTypes.number,
  showLabel: PropTypes.bool,
};

export default CertificateBadge;
