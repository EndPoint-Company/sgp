import StudentLayout from '../../layouts/StudentLayout';
import StudentHomePage from '../../features/student/home/StudentHomePage';

export default function Home() {
  return (
    <StudentLayout>
      <StudentHomePage />
    </StudentLayout>
  );
}