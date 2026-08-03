import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const CheatingLogContext = createContext();

const emptyCounts = {
  noFaceCount: 0,
  multipleFaceCount: 0,
  cellPhoneCount: 0,
  prohibitedObjectCount: 0,
  // Secure browser control violations
  tabSwitchCount: 0,
  copyPasteAttemptCount: 0,
  fullscreenExitCount: 0,
};

export const CheatingLogProvider = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [cheatingLog, setCheatingLog] = useState({
    ...emptyCounts,
    examId: '',
    username: userInfo?.name || '',
    email: userInfo?.email || '',
    branch: userInfo?.branch || '',
    department: userInfo?.department || '',
  });

  useEffect(() => {
    if (userInfo) {
      setCheatingLog((prev) => ({
        ...prev,
        username: userInfo.name,
        email: userInfo.email,
        branch: userInfo.branch || '',
        department: userInfo.department || '',
      }));
    }
  }, [userInfo]);

  const updateCheatingLog = (newLog) => {
    setCheatingLog((prev) => {
      const updatedLog = { ...prev, ...newLog };
      Object.keys(emptyCounts).forEach((key) => {
        updatedLog[key] = Number(newLog[key] ?? prev[key] ?? 0);
      });
      console.log('Updated cheating log:', updatedLog); // Debug log
      return updatedLog;
    });
  };

  // Convenience helper: bump a single secure-browser-control violation counter
  // by 1 (used for tab-switch / copy-paste / fullscreen-exit detection).
  const recordViolation = (countKey) => {
    setCheatingLog((prev) => ({
      ...prev,
      [countKey]: Number(prev[countKey] || 0) + 1,
    }));
  };

  const resetCheatingLog = (examId) => {
    const resetLog = {
      ...emptyCounts,
      examId: examId,
      username: userInfo?.name || '',
      email: userInfo?.email || '',
      branch: userInfo?.branch || '',
      department: userInfo?.department || '',
    };
    console.log('Reset cheating log:', resetLog); // Debug log
    setCheatingLog(resetLog);
  };

  return (
    <CheatingLogContext.Provider
      value={{ cheatingLog, updateCheatingLog, resetCheatingLog, recordViolation }}
    >
      {children}
    </CheatingLogContext.Provider>
  );
};

export const useCheatingLog = () => {
  const context = useContext(CheatingLogContext);
  if (!context) {
    throw new Error('useCheatingLog must be used within a CheatingLogProvider');
  }
  return context;
};
