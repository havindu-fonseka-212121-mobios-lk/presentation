import { Box, Container, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import PrizeWinnersService from '../services/prize-winners.services';
import SessionsFilter from './SessionsFilter';
import AvailableCourses from './AvailableCourses';

const PrizeGivingCeremony = () => {
  const [triggerValidation, setTriggerValidation] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [sessionsLoaded, setSessionsLoaded] = useState(false);
  const [sessionCourseIdList, setSessionCourseIdList] = useState([]);
  const [filteredAvailableCourses, setFilteredAvailableCourses] = useState([]);
  const [configMode, setConfigMode] = useState(''); // FREEZED SAVED NEW
  const [filters, setFilters] = useState({
    examYear: '2025',
    examModeId: null,
    examTypeId: null,
    gradeId: null,
  });
  const mandatoryKeys = ['examYear'];

  // controllers for aborting previous requests
  const sessionsAbortController = useRef(null);
  const configAbortController = useRef(null);

  // Courses data from API
  const [allCourses, setAllCourses] = useState([]);

  // Available courses that haven't been assigned to any session
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    // Update available courses when allCourses changes
    setAvailableCourses([...allCourses]);
  }, [allCourses]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => {
      if (JSON.stringify(prevFilters) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return prevFilters;
    });
  }, []);


  // === FETCH COURSES ===
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await PrizeWinnersService.groupByCourse(filters);

      if (response?.data?.data) {
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

          // Calculate total students for each session after updating course data
          return updatedSessions.map(session => ({
            ...session,
            totalStudents: calculateSessionTotal(session.courses)
          }));
        });

        // Set available courses excluding those already in sessions using current sessions state
        setSessions(currentSessions => {
          const sessionCourseIds = currentSessions.flatMap(session =>
            session.courses.map(course => course.id)
          );
          const availableCoursesFiltered = mappedCourses.filter(course =>
            !sessionCourseIds.includes(course.id)
          );
          setAvailableCourses(availableCoursesFiltered);
          return currentSessions; // Return unchanged sessions
        });
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // toast.error('Failed to fetch courses');
    } finally {
      setLoadingCourses(false);
    }
  };

    const calculateSessionTotal = (courses) => courses.reduce((total, course) => total + course.studentCount, 0);


  useEffect(() => {
    // Fetch courses when filters change
    fetchCourses();
  }, [filters.examYear, filters.examModeId, filters.examTypeId, filters.gradeId]);

  useEffect(() => {
    setFilteredAvailableCourses(availableCourses.filter(course =>
      !sessionCourseIdList.includes(course.id)
    ));
  }, [availableCourses, sessionCourseIdList]);

  const [sessions, setSessions] = useState([
    {
      id: 'session-1',
      name: 'Prize Giving 1',
      date: '',
      courses: [],
      totalStudents: 0
    }
  ]);

  // Cleanup pending requests on unmount to avoid stale updates
  useEffect(() => () => {
    try { configAbortController.current?.abort(); } catch { /* ignore */ }
    try { sessionsAbortController.current?.abort(); } catch { /* ignore */ }
  }, []);

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

export default PrizeGivingCeremony;