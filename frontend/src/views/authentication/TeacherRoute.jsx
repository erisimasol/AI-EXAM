import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { EXAM_MANAGER_ROLES } from 'src/data/orgData';

const TeacherRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const canManageExams = EXAM_MANAGER_ROLES.includes(userInfo?.role);

  return canManageExams ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
export default TeacherRoute;
