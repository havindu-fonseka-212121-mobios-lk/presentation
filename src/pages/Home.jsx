import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAction } from '../reducers/auth.reducer';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Stack 
} from '@mui/material';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#333', mb: 3 }}>
            Welcome to Home Page
          </Typography>
          {user && (
            <Paper
              sx={{
                bgcolor: '#f8f9fa',
                p: 2,
                borderRadius: 2,
                mb: 3,
                textAlign: 'left',
              }}
              elevation={0}
            >
              <Stack spacing={1.5}>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <strong style={{ color: '#333' }}>Name:</strong> {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <strong style={{ color: '#333' }}>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <strong style={{ color: '#333' }}>Mobile:</strong> {user.mobileNo}
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  <strong style={{ color: '#333' }}>Role:</strong> {user.userRole?.position}
                </Typography>
              </Stack>
            </Paper>
          )}
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Logout
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
