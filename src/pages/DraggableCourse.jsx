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
        mb: 1,
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border:'1px solid #ccc',
        borderRadius: '7px',
        backgroundColor: isInSession ? '#fff' : '#fff',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
        // Modern color line from right corner
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '4px',
          height: '100%',
          bgcolor: modeColor,
          // background: `linear-gradient(135deg, transparent 0%, transparent 30%, ${modeColor} 30%, ${modeColor} 100%)`,
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
        },
      }}
    >
      <Typography variant="body2" sx={{ overflow: 'auto', scrollbarWidth: 'none' }}>
        {course?.name}
      </Typography>
      <Typography variant="body2" sx={{ px: 2 }}>
        {course?.studentCount}
      </Typography>
    </Box>
  );
};

export default DraggableCourse;
