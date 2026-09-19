import { useMediaQuery, Box, Drawer, Typography } from '@mui/material';
import SidebarItems from './SidebarItems';
import { SupportCard } from './Updrade';
import { GRADIENTS, BRAND, ORG } from 'src/theme/brand';

// Brand header used at the top of both the desktop and mobile drawers:
// lockup, the 70/30 rule, then the system name as an eyebrow. The rule is the
// only decoration — it does a job (it separates identity from navigation) and
// it encodes the brand ratio while doing it.
const SidebarBrand = ({ compact = false }) => (
  <Box sx={{ px: compact ? 2 : 3, pt: 2.5, pb: 1.5, width: '100%' }}>
    <Box sx={{ height: 3, borderRadius: 1, background: GRADIENTS.brandBar }} />
    <Typography
      variant="overline"
      component="p"
      sx={{ color: BRAND.inkMuted, mt: 1, lineHeight: 1.4, fontSize: '0.625rem' }}
    >
      {ORG.systemName}
    </Typography>
  </Box>
);

const Sidebar = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const sidebarWidth = '270px';

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <Drawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              width: sidebarWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: '100%',
            }}
          >
            {/* ------------------------------------------- */}
            {/* Logo */}
            {/* ------------------------------------------- */}
            <SidebarBrand />

            <Box>
              {/* ------------------------------------------- */}
              {/* Sidebar Items */}
              {/* ------------------------------------------- */}
              <SidebarItems />
              <SupportCard />
            </Box>
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          width: sidebarWidth,
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      {/* ------------------------------------------- */}
      {/* Logo */}
      {/* ------------------------------------------- */}
      <SidebarBrand compact />
      {/* ------------------------------------------- */}
      {/* Sidebar For Mobile */}
      {/* ------------------------------------------- */}
      <SidebarItems />
      <SupportCard />
    </Drawer>
  );
};

export default Sidebar;
