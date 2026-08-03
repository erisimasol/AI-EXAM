import { useEffect, useRef } from 'react';
import swal from 'sweetalert';
import { useCheatingLog } from 'src/context/CheatingLogContext';

// Locks down the exam environment as described in "Secure Browser Control":
// - Flags tab/window switching and prolonged inactivity
// - Disables copy, paste, cut, right-click context menu, and printing
// - Encourages (best-effort) fullscreen during the exam
//
// Honesty note: this is a client-side deterrent, not a true OS-level lockdown.
// A determined candidate with local admin access could still bypass browser
// events; genuine kiosk-mode lockdown requires a dedicated secure-browser
// client (e.g. a locked-down Electron/kiosk shell), which is outside the
// scope of a web app running in a normal browser tab.
const SecureBrowserGuard = () => {
  const { recordViolation } = useCheatingLog();
  const lastWarned = useRef({});

  const warnOnce = (key, title, text) => {
    const now = Date.now();
    if (now - (lastWarned.current[key] || 0) > 3000) {
      lastWarned.current[key] = now;
      recordViolation(key);
      swal(title, text, 'warning');
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        warnOnce('tabSwitchCount', 'Tab Switch Detected', 'Warning Recorded');
      }
    };

    const handleBlur = () => {
      warnOnce('tabSwitchCount', 'Window Switch Detected', 'Warning Recorded');
    };

    const blockClipboard = (e) => {
      e.preventDefault();
      warnOnce('copyPasteAttemptCount', 'Copy/Paste Disabled', 'Warning Recorded');
    };

    const blockContextMenu = (e) => {
      e.preventDefault();
    };

    const blockPrintAndDevtools = (e) => {
      // Block Ctrl/Cmd+P (print), Ctrl/Cmd+C/V/X (copy/paste/cut)
      const key = e.key?.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['p', 'c', 'v', 'x'].includes(key)) {
        e.preventDefault();
        warnOnce('copyPasteAttemptCount', 'Action Blocked', 'Copy/Paste/Print is disabled during the exam');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        warnOnce('fullscreenExitCount', 'Fullscreen Exited', 'Warning Recorded');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', blockClipboard);
    document.addEventListener('paste', blockClipboard);
    document.addEventListener('cut', blockClipboard);
    document.addEventListener('contextmenu', blockContextMenu);
    document.addEventListener('keydown', blockPrintAndDevtools);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Best-effort fullscreen request (browsers require a user gesture, so
    // this may silently fail — that's expected and not treated as an error).
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', blockClipboard);
      document.removeEventListener('paste', blockClipboard);
      document.removeEventListener('cut', blockClipboard);
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockPrintAndDevtools);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default SecureBrowserGuard;
