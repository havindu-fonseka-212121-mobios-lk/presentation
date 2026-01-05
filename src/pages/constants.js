export const getHeights = (sessionCount) => ({
        sessionBox: sessionCount < 4 ? '815px' : '400px',
        sessionCourseList: sessionCount < 4 ? '690px' : '273px',
        availableCourses: sessionCount < 3 ? '815px' : sessionCount === 3 ? '951px' : '816px',
        availableCourseList: sessionCount < 3 ? '740px' : sessionCount === 3 ? '870px' : '740px',
});
