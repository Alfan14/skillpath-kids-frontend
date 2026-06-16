import { TeacherDashboardClient } from './teacher-dashboard-client';

export const metadata = {
  title: 'Teacher Dashboard - SkillPath Kids',
};

export const dynamic = 'force-dynamic';

export default function TeacherDashboardPage() {
  return <TeacherDashboardClient />;
}
