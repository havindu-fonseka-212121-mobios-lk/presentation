import { Box, Typography, Divider, CircularProgress } from '@mui/material';
import { getHeights } from './constants';
import { useDroppable } from '@dnd-kit/core';
import DraggableCourse from './DraggableCourse';


// Droppable Container Component
const DroppableContainer = ({ id, children }) => {
    const { isOver, setNodeRef } = useDroppable({
        id,
    });

    return (
        <Box
            ref={setNodeRef}
            sx={{
                backgroundColor: isOver ? '#e8f5e8' : 'transparent',
                transition: 'background-color 0.2s ease',
                borderRadius: '4px',
                minHeight: '200px',
            }}
        >
            {children}
        </Box>
    );
};

const AvailableCourses = ({ availableCourses, sessionCount, loading = false, totalCourses = 0 }) => {
    const heights = getHeights(sessionCount);
    
    return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #B71D18',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                height: heights.availableCourses,
            }}>
                <Typography variant="h6" sx={{ textAlign: 'center', color: '#B71D18', fontWeight: 'bold' }}>
                    Available Courses
                </Typography>
                <Divider sx={{ my: 1 }} />

                <DroppableContainer id="available-courses">
                    <Box sx={{
                        flex: 1,
                        height: heights.availableCourseList,
                        borderRadius: '4px',
                        overflow: 'auto',
                        scrollbarWidth: 'none', // Firefox
                        '&::-webkit-scrollbar': {
                            display: 'none', // Chrome, Safari, Edge
                        },
                        msOverflowStyle: 'none', // IE
                    }}>
                        {loading ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                gap: 2
                            }}>
                                <CircularProgress size={40} sx={{ color: '#B71D18' }} />
                                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                                    Loading available courses...
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                {availableCourses.map((course) => (
                                    <DraggableCourse key={course.id} course={course} />
                                ))}

                                {availableCourses.length === 0 && totalCourses > 0 && (
                                    <Box sx={{
                                        textAlign: 'center',
                                        color: '#999',
                                        fontStyle: 'italic',
                                        mt: 4
                                    }}>
                                        All courses have been assigned to sessions
                                    </Box>
                                )}

                                {availableCourses.length === 0 && totalCourses === 0 && (
                                    <Box sx={{
                                        textAlign: 'center',
                                        color: '#999',
                                        fontStyle: 'italic',
                                        mt: 4
                                    }}>
                                        No courses available
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </DroppableContainer>
            </Box>
    );
};

export default AvailableCourses;
