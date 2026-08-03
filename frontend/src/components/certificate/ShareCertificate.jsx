import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Tooltip, IconButton, Snackbar } from '@mui/material';
import {
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconMail,
  IconLink,
  IconShare,
} from '@tabler/icons-react';
import { buildVerifyUrl } from '../../utils/qrcode';
import { BRAND, ORG } from '../../theme/brand';

// NOTE: the hex values below are the share platforms' own brand colours and are
// deliberately NOT replaced with Amigos tokens — a LinkedIn button that is not
// LinkedIn blue reads as a phishing button.

// Renders social-share buttons that deep-link to each platform's share
// composer, pre-filled with the certificate's public verification URL and a
// short caption. LinkedIn additionally supports the "Add to profile" flow.
const ShareCertificate = ({ certificate }) => {
  const [toastOpen, setToastOpen] = useState(false);

  const verifyUrl = buildVerifyUrl(certificate.verificationCode || certificate.serialNumber);
  const orgName = certificate.org?.shortName || ORG.shortName;
  const caption = `I earned a ${certificate.badgeLabel} certificate for "${certificate.examName}" from ${orgName} (${Math.round(
    certificate.percentage,
  )}%). Verify it here:`;

  const enc = encodeURIComponent;

  const links = [
    {
      key: 'linkedin',
      label: 'Share on LinkedIn',
      color: '#0A66C2',
      Icon: IconBrandLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(verifyUrl)}`,
    },
    {
      key: 'linkedin-cert',
      label: 'Add to LinkedIn profile',
      color: '#0A66C2',
      Icon: IconBrandLinkedin,
      url:
        `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
        `&name=${enc(certificate.examName)}` +
        `&organizationName=${enc(orgName)}` +
        `&certUrl=${enc(verifyUrl)}` +
        `&certId=${enc(certificate.serialNumber)}` +
        (certificate.issuedAt
          ? `&issueYear=${new Date(certificate.issuedAt).getFullYear()}` +
            `&issueMonth=${new Date(certificate.issuedAt).getMonth() + 1}`
          : ''),
      variant: 'outlined',
    },
    {
      key: 'x',
      label: 'Share on X',
      color: '#000000',
      Icon: IconBrandTwitter,
      url: `https://twitter.com/intent/tweet?text=${enc(caption)}&url=${enc(verifyUrl)}`,
    },
    {
      key: 'facebook',
      label: 'Share on Facebook',
      color: '#1877F2',
      Icon: IconBrandFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${enc(verifyUrl)}&quote=${enc(caption)}`,
    },
    {
      key: 'whatsapp',
      label: 'Share on WhatsApp',
      color: '#25D366',
      Icon: IconBrandWhatsapp,
      url: `https://wa.me/?text=${enc(`${caption} ${verifyUrl}`)}`,
    },
    {
      key: 'telegram',
      label: 'Share on Telegram',
      color: '#26A5E4',
      Icon: IconBrandTelegram,
      url: `https://t.me/share/url?url=${enc(verifyUrl)}&text=${enc(caption)}`,
    },
    {
      key: 'email',
      label: 'Share via Email',
      color: BRAND.inkMuted,
      Icon: IconMail,
      url: `mailto:?subject=${enc(`My ${orgName} Certificate`)}&body=${enc(`${caption}\n${verifyUrl}`)}`,
    },
  ];

  const openShare = (url) => window.open(url, '_blank', 'noopener,noreferrer,width=640,height=640');

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${orgName} Certificate`, text: caption, url: verifyUrl });
      } catch (_) {
        /* user dismissed */
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setToastOpen(true);
    } catch (_) {
      window.prompt('Copy this verification link:', verifyUrl);
    }
  };

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
        {links.map(({ key, label, color, Icon, url, variant }) =>
          variant === 'outlined' ? (
            <Button
              key={key}
              size="small"
              variant="outlined"
              startIcon={<Icon size={18} />}
              onClick={() => openShare(url)}
              sx={{ borderColor: color, color }}
            >
              Add to LinkedIn
            </Button>
          ) : (
            <Tooltip title={label} key={key}>
              <IconButton
                onClick={() => openShare(url)}
                sx={{
                  bgcolor: color,
                  color: '#fff',
                  '&:hover': { bgcolor: color, opacity: 0.88 },
                }}
                size="medium"
              >
                <Icon size={20} />
              </IconButton>
            </Tooltip>
          ),
        )}

        <Tooltip title="Copy verification link">
          <IconButton onClick={handleCopy} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <IconLink size={20} />
          </IconButton>
        </Tooltip>

        <Button
          size="small"
          variant="text"
          startIcon={<IconShare size={18} />}
          onClick={handleNativeShare}
        >
          More
        </Button>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        message="Verification link copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

ShareCertificate.propTypes = {
  certificate: PropTypes.object.isRequired,
};

export default ShareCertificate;
