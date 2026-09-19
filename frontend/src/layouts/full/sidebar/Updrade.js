import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { IconShieldCheck } from '@tabler/icons-react';
import { BRAND, ORG } from 'src/theme/brand';

// Replaces the vendor template's "Upgrade" upsell. The foot of the sidebar is
// prime real estate in an exam system, so it now carries the thing a candidate
// or invigilator actually needs there: where to go when something goes wrong
// mid-attempt, and who issued the credential they are working towards.
export const SupportCard = () => (
  <Box
    sx={{
      m: 2.5,
      p: 2,
      borderRadius: 2,
      bgcolor: BRAND.orangeTint,
      border: `1px solid ${BRAND.orangeTintStrong}`,
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
      <IconShieldCheck size={18} color={BRAND.orangeDark} />
      <Typography variant="h6" sx={{ color: BRAND.blueDark, fontSize: '0.85rem' }}>
        Need help during an exam?
      </Typography>
    </Stack>
    <Typography variant="body2" sx={{ color: BRAND.inkMuted, mb: 1.5 }}>
      Contact the {ORG.unit.split('—')[0].trim()} before your timer runs out — attempts cannot be
      restarted once submitted.
    </Typography>
    <Button
      size="small"
      variant="contained"
      color="primary"
      href="mailto:pmerlf@amigossacco.com?subject=Exam%20support%20request"
    >
      Contact PMERLF
    </Button>
    <Box mt={2} display="flex" alignItems="center" gap={0.75}>
      <Typography variant="caption" sx={{ color: BRAND.inkFaint }}>
        Issued by {ORG.shortName}
      </Typography>
    </Box>
  </Box>
);

// Kept as a named alias so any legacy import of `Upgrade` still resolves.
export const Upgrade = SupportCard;

export default SupportCard;
