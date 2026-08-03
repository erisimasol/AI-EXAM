import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ANALYTICS_ROLES } from 'src/data/orgData';

const AnalyticsRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const canViewAnalytics = ANALYTICS_ROLES.includes(userInfo?.role);

  return canViewAnalytics ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
export default AnalyticsRoute;
