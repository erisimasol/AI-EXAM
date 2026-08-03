import React from 'react';
import PropTypes from 'prop-types';

// SVGR (built into react-scripts) inlines these as real DOM <svg> elements.
// That matters twice over: no extra network request, and html2canvas can
// rasterise them when a certificate is exported to PDF — a linked <img> often
// comes out blank in that path.
import { ReactComponent as EmblemFull } from 'src/assets/images/logos/amigos-logo-full.svg';
import { ReactComponent as EmblemFullWhite } from 'src/assets/images/logos/amigos-logo-full-white.svg';
import { ReactComponent as Emblem } from 'src/assets/images/logos/amigos-mark.svg';
import { ReactComponent as EmblemWhite } from 'src/assets/images/logos/amigos-mark-white.svg';
import { ReactComponent as Lockup } from 'src/assets/images/logos/amigos-logo.svg';
import { ReactComponent as LockupLight } from 'src/assets/images/logos/amigos-logo-light.svg';
import { ReactComponent as Seal } from 'src/assets/images/logos/amigos-seal.svg';

// =============================================================================
// AMIGOS SACCO — LOGO COMPONENT
//
// The artwork is the official Amigos emblem — four orange arcs and five member
// dots forming a cooperative circle around the Amharic motto "ህብረት ለስምረት!"
// — vector-traced from the supplied file.
//
// RESPONSIVE LOGO RULE
// The motto sits inside the circle and stops being legible below roughly
// 120px. So the system carries two emblem cuts and picks between them by size:
//
//   variant="full"    complete emblem WITH the motto   — use at >= 120px
//                     (certificate, auth screens, verification page)
//   variant="mark"    emblem WITHOUT the motto         — use below 120px
//                     (favicon, app bar, avatars, watermark)
//   variant="lockup"  emblem + AMIGOS SACCO wordmark   — sidebar, page headers
//   variant="seal"    circular issuing seal            — certificates only
//
// `variant="auto"` applies that rule for you from the `height` prop, which is
// the safest default when you are not sure how large the logo will end up.
//
// tone="light" swaps to the white cuts for dark backgrounds.
// =============================================================================

const MOTTO_LEGIBILITY_THRESHOLD = 120;

const AmigosLogo = ({
  variant = 'auto',
  tone = 'dark',
  height,
  title = 'Amigos SACCO',
  style,
  ...rest
}) => {
  const light = tone === 'light';

  if (variant === 'lockup') {
    const h = height || 46;
    const Cmp = light ? LockupLight : Lockup;
    // Lockup viewBox is 1200 x 300.
    return (
      <Cmp
        height={h}
        width={(h * 1200) / 300}
        role="img"
        aria-label={title}
        style={style}
        {...rest}
      />
    );
  }

  if (variant === 'seal') {
    const h = height || 110;
    return <Seal height={h} width={h} role="img" aria-label={`${title} seal`} style={style} {...rest} />;
  }

  const h = height || 40;
  const wantsMotto =
    variant === 'full' || (variant === 'auto' && h >= MOTTO_LEGIBILITY_THRESHOLD);

  let Cmp;
  if (wantsMotto) Cmp = light ? EmblemFullWhite : EmblemFull;
  else Cmp = light ? EmblemWhite : Emblem;

  return <Cmp height={h} width={h} role="img" aria-label={title} style={style} {...rest} />;
};

AmigosLogo.propTypes = {
  variant: PropTypes.oneOf(['auto', 'full', 'mark', 'lockup', 'seal']),
  tone: PropTypes.oneOf(['dark', 'light']),
  height: PropTypes.number,
  title: PropTypes.string,
  style: PropTypes.object,
};

export default AmigosLogo;
