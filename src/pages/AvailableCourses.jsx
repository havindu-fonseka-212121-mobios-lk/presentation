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
    
    return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: '#ffffff',
                boxShadow: '0 2px 8px rgba(183, 29, 24, 0.1)',
            }}>
                <Typography variant="h5" sx={{ textAlign: 'center', color: '#1976D2', fontWeight: 'bold', mb: 2 }}>
                    Available Courses
                </Typography>
                <Divider sx={{ mb: 3, borderColor: '#1976D2', borderWidth: 1 }} />

                <DroppableContainer id="available-courses">
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)',
                            xl: 'repeat(5, 1fr)',
                        },
                        gap: 2,
                        maxHeight: '500px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        pr: 1,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#1976D2',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#8B1612',
                        },
                    }}>
                        {loading ? (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%',
                                gap: 2
                            }}>
                                <CircularProgress size={40} sx={{ color: '#1976D2' }} />
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
