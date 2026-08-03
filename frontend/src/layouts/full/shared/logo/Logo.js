import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import AmigosLogo from 'src/components/brand/AmigosLogo';

const LinkStyled = styled(Link)(() => ({
  height: '54px',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  overflow: 'hidden',
}));

// Thin wrapper kept at its original path so every existing import site
// (sidebar, auth screens) picks up the Amigos lockup without changes.
const Logo = ({ tone = 'dark', height = 44 }) => (
  <LinkStyled to="/" aria-label="Amigos SACCO — go to dashboard">
    <AmigosLogo variant="lockup" tone={tone} height={height} />
  </LinkStyled>
);

Logo.propTypes = {
  tone: PropTypes.oneOf(['dark', 'light']),
  height: PropTypes.number,
};

export default Logo;
