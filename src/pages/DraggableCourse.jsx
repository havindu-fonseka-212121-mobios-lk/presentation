import { Box, Typography } from '@mui/material';
import { useDraggable } from '@dnd-kit/core';

const DraggableCourse = ({ course, isInSession = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: course?.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Define colors based on course mode
  const getModeColor = (mode) => {
    switch (mode?.toUpperCase()) {
      case 'PRACTICAL':
        return '#6A0066'; // Modern coral red for practical
      case 'THEORY':
        return '#FF0066'; // Modern teal for theory
      default:
        return '#95A5A6'; // Default gray
    }
  };

  const modeColor = getModeColor(course?.mode);

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        border: '2px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#fff',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
        transition: 'all 0.2s ease',
        '&:hover': {
          // borderColor: modeColor,
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
          // transform: 'translateY(-2px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          // bgcolor: modeColor,
        },
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 500,
          fontSize: '0.875rem',
          lineHeight: 1.4,
          minHeight: '40px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {course?.name}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pt: 1,
        borderTop: '1px solid #f0f0f0'
      }}>
        <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
          Students:
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'bold',
            color: modeColor,
            fontSize: '1rem'
          }}
        >
          {course?.studentCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default DraggableCourse;
