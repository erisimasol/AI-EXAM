import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { EXAM_MANAGER_ROLES, ANALYTICS_ROLES } from 'src/data/orgData';

// Maps a menu item's default English title to its i18n translation key.
// Falls back to the raw title when no translation exists.
const TITLE_TO_I18N_KEY = {
  Dashboard: 'nav.dashboard',
  Exams: 'nav.exams',
  Result: 'nav.result',
  'Create Exam': 'nav.createExam',
  'Add Questions': 'nav.addQuestions',
  'Exam Logs': 'nav.examLogs',
  'Branch & Department Analytics': 'nav.analytics',
};

const SidebarItems = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const { t } = useTranslation();

  const canManageExams = EXAM_MANAGER_ROLES.includes(userInfo.role);
  const canViewAnalytics = ANALYTICS_ROLES.includes(userInfo.role);

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // Role-based access control: department heads/admins manage exams;
          // supervisors/department heads/admins can view cross-branch analytics;
          // employees only see items relevant to their own role.
          if (!canManageExams && ['Create Exam', 'Add Questions', 'Exam Logs'].includes(item.title)) {
            return null;
          }
          if (!canViewAnalytics && item.title === 'Branch & Department Analytics') {
            return null;
          }

          // {/********SubHeader**********/}
          if (item.subheader) {
            if (!canManageExams && item.subheader === 'Teacher') {
              return null; // Don't render the "Teacher" subheader for employees
            }

            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            const translatedItem = {
              ...item,
              title: t(TITLE_TO_I18N_KEY[item.title] || item.title, item.title),
            };
            return <NavItem item={translatedItem} key={item.id} pathDirect={pathDirect} />;
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
