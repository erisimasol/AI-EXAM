# Signature images

Drop transparent PNGs here and reference them from `.env`:

```env
CEO_SIGNATURE_IMAGE=/signatures/ceo-signature.png
PMERLF_SIGNATURE_IMAGE=/signatures/pmerlf-signature.png
```

**Requirements**
- Transparent background (PNG, not JPG — a white box will show on the certificate)
- Roughly 600 × 160px, signature filling the frame with minimal margin
- Dark ink; the certificate renders it at about 32px tall

**Leave this empty and the certificate prints a ruled line instead**, which is
the correct behaviour if certificates are to be wet-signed after printing.

Treat these files as controlled. Anyone who can write to this folder can put a
signature on every certificate the system issues.
