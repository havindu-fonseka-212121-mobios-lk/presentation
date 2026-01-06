import { Container, Grid } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import PrizeWinnersService from '../services/prize-winners.services';
import SessionsFilter from './SessionsFilter';
import AvailableCourses from './AvailableCourses';

const PrizeGivingCeremonyV3 = () => {
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [filteredAvailableCourses, setFilteredAvailableCourses] = useState([]);
  const [configMode, setConfigMode] = useState('');
  const [filters, setFilters] = useState({
    examYear: '2025',
    examModeId: null,
    examTypeId: null,
    gradeId: null,
  });
  const mandatoryKeys = ['examYear'];

  const [allCourses, setAllCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [sessions, setSessions] = useState([
    {
      id: 'session-1',
      name: 'Prize Giving 1',
      date: '',
      courses: [],
      totalStudents: 0
    }
  ]);

  useEffect(() => {
    setAvailableCourses([...allCourses]);
  }, [allCourses]);

  useEffect(() => {
    // availableCourses is already filtered in fetchCourses, just pass it through
    setFilteredAvailableCourses(availableCourses);
  }, [availableCourses]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => {
      if (JSON.stringify(prevFilters) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return prevFilters;
    });
  }, []);

  const calculateSessionTotal = (courses) => courses.reduce((total, course) => total + course.studentCount, 0);

  // === FETCH COURSES with Cleanup Flag (Alternative to AbortController) ===
  useEffect(() => {
    // Flag to track if this effect is still active
    let isActive = true;

    const fetchCourses = async () => {
      setLoadingCourses(true);
      setAvailableCourses([]); // Clear previous courses

      try {
        const response = await PrizeWinnersService.groupByCourse(filters);

        // Only update state if this effect is still active (not stale)
        if (isActive && response?.data?.data) {
          const mappedCourses = response.data.data.map((item) => {
            const { course, studentCount } = item;
            const { examinationMode, examinationType, grade } = course;
            const courseName = `${examinationMode.examinationMode} - ${examinationType.description} - ${grade.grade}`;
            return {
              id: course.courseId,
              name: courseName,
              studentCount,
              mode: examinationType.mode,
            };
          });

          setAllCourses(mappedCourses);

          // Update student counts in existing sessions
          setSessions(prevSessions => {
            const updatedSessions = prevSessions.map(session => ({
              ...session,
              courses: session.courses.map(sessionCourse => {
                const courseData = mappedCourses.find(course => course.id === sessionCourse.id);
                return courseData ? { ...courseData } : sessionCourse;
              }),
            }));

            return updatedSessions.map(session => ({
              ...session,
              totalStudents: calculateSessionTotal(session.courses)
            }));
          });

          // Set available courses excluding those already in sessions
          setSessions(currentSessions => {
            const sessionCourseIds = currentSessions.flatMap(session =>
              session.courses.map(course => course.id)
            );
            const availableCoursesFiltered = mappedCourses.filter(course =>
              !sessionCourseIds.includes(course.id)
            );
            setAvailableCourses(availableCoursesFiltered);
            return currentSessions;
          });
        }
      } catch (error) {
        // Only log error if this effect is still active
        if (isActive) {
          console.error("Error fetching courses:", error);
        }
      } finally {
        // Only clear loading if this effect is still active
        if (isActive) {
          setLoadingCourses(false);
        }
      }
    };

    fetchCourses();

    // Cleanup function: mark this effect as inactive when filters change
    return () => {
      isActive = false; // Flag stale requests to ignore their responses
    };
  }, [filters.examYear, filters.examModeId, filters.examTypeId, filters.gradeId]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item size={12} mt={10}>
          <SessionsFilter
            handleDataChange={handleFilterChange}
            mandatoryKeys={mandatoryKeys}
            triggerValidation={triggerValidation}
            initialFilters={filters}
            configMode={configMode}
          />
        </Grid>
      </Grid>

      {configMode !== 'FREEZED' && (
        <Grid container spacing={2} mt={2}>
          <Grid item size={12}>
            <AvailableCourses
              availableCourses={filteredAvailableCourses}
              sessionCount={sessions.length}
              loading={loadingCourses}
              totalCourses={allCourses.length}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default PrizeGivingCeremonyV3;
