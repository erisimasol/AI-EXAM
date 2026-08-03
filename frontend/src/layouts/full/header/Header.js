import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import AmigosLogo from 'src/components/brand/AmigosLogo';
import { BRAND, GRADIENTS, ORG } from 'src/theme/brand';

const Header = (props) => {
  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { userInfo } = useSelector((state) => state.auth);
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    borderBottom: `1px solid ${BRAND.line}`,
    // The 70/30 rule runs along the foot of the app bar on every screen.
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '3px',
      background: GRADIENTS.brandBar,
    },
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'inline',
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        {/* Identity anchor. On the exam layout there is no sidebar, so this is
            the only place the candidate sees who is invigilating them. */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
          <AmigosLogo variant="mark" height={28} />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography
              variant="h6"
              sx={{ color: BRAND.blue, lineHeight: 1.1, fontSize: '0.9rem' }}
            >
              {ORG.shortName}
            </Typography>
            <Typography variant="caption" sx={{ color: BRAND.inkFaint }}>
              {ORG.systemName}
            </Typography>
          </Box>
        </Stack>

        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
          sx={{
            ...(typeof anchorEl2 === 'object' && {
              color: 'primary.main',
            }),
          }}
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Select
            size="small"
            value={i18n.language?.startsWith('am') ? 'am' : 'en'}
            onChange={handleLanguageChange}
            sx={{ minWidth: 90, height: 36 }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="am">አማርኛ</MenuItem>
          </Select>
          <Typography variant="subtitle1" sx={{ color: BRAND.blueDark, fontWeight: 600 }}>
            Hello, {_.startCase(userInfo.name)}
          </Typography>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
