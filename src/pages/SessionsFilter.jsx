import React, { useEffect, useState, useRef } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Autocomplete, TextField, IconButton, InputAdornment } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import PrizeGivingSessionService from '../../app/services/prize-giving-session.services';
import ExamService from '../services/exam.services';
import CourseService from '../services/course.services';

const SessionsFilter = ({ 
  handleDataChange, 
  mandatoryKeys = [], 
  triggerValidation, 
  initialFilters = {}, 
  configMode,
  visibleFields = ['examYear', 'examModeId', 'examTypeId', 'gradeId'] // Default fields for Prize Giving Ceremony
}) => {
  const [examModes, setExamModes] = useState([]);
  const [examTypes, setExamTypes] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sessions, setSessions] = useState([]);
  // AbortController for sessions loading
  const sessionsAbortController = useRef(null);
  const [filters, setFilters] = useState({
    examYear: initialFilters.examYear || "2025",
    examModeId: initialFilters.examModeId || null,
    examTypeId: initialFilters.examTypeId || null,
    gradeId: initialFilters.gradeId || null,
    sessionId: initialFilters.sessionId || 'all',
    studentName: initialFilters.studentName || '',
  });
  // debounce ref for student name input
  const studentNameDebounceRef = useRef(null);

  const {
    control,
    formState: { errors },
    trigger,
    setValue,
  } = useForm({
    defaultValues: {
      examYear: { label: initialFilters.examYear || "2025", value: initialFilters.examYear || "2025" },
      examModeId: null,
      examTypeId: null,
      gradeId: null,
      sessionId: { label: 'All', value: 'all' },
      studentName: '',
    },
  });

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const endYear = currentYear + 1;
    const yearsArray = [];
    
    for (let year = 2024; year <= endYear; year += 1) {
      yearsArray.push({
        yearId: year - 2023, // Start from 1 for 2024
        year: year.toString()
      });
    }
    
    return yearsArray;
  };

  const years = generateYears();

  const loadExamModes = async () => {
    try {
      const res = await ExamService.examinationMode({ page: 1, count: 10 });
      if (res.data.responseCode === '00') {
        setExamModes(res.data.data);
      } else {
        console.error(`Failed to load exam mode: ${res.message}`);
        toast.error('Failed to load exam mode');
      }
    } catch (e) {
      console.error('An error occurred while loading exam mode', e);
      toast.error('Failed to load exam mode');
    }
  };

  const loadExamTypes = async (id) => {
    try {
      const res = await CourseService.examTypeGetByID(id);
      if (res.data.responseCode === '00') {
        setExamTypes(res.data.data);
      } else {
        console.error(`Failed to load exam type: ${res.message}`);
        toast.error('Failed to load exam types');
      }
    } catch (e) {
      console.error('An error occurred while loading exam type', e);
      toast.error('Failed to load exam types');
    }
  };

  const loadGrades = async (examModeId, examTypeId) => {
    try {
      const res = await CourseService.getCourseByCategoryAndSubject(examModeId, examTypeId);
      if (res.data.responseCode === '00') {
        setGrades(res.data.data);
      } else {
        console.error(`Failed to load grades: ${res.message}`);
        toast.error(`Failed to load grades`);
      }
    } catch (e) {
      console.error('An error occurred while loading grades', e);
      toast.error(`Failed to load grades`);
    }
  };

  // const loadSessions = async (year) => {
  //   // cancel any previous in-flight sessions request
  //   if (sessionsAbortController.current) {
  //     try { sessionsAbortController.current.abort(); } catch { /* ignore */ }
  //   }
  //   const controller = new AbortController();
  //   sessionsAbortController.current = controller;

  //   try {
  //     const res = await PrizeGivingSessionService.sessionsList(year, { signal: controller.signal });
  //     if (!controller.signal.aborted) {
  //       if (res.data.responseCode === '00' && res.data.sessionList) {
  //         const sessionOptions = [
  //           { sessionId: 'all', sessionName: 'All' },
  //           ...res.data.sessionList
  //         ];
  //         setSessions(sessionOptions);
  //       } else {
  //         console.error(`Failed to load sessions: ${res.message}`);
  //         toast.error('Failed to load sessions');
  //       }
  //     }
  //   } catch (e) {
  //     if (e?.name === 'CanceledError' || e?.name === 'AbortError') {
  //       console.log('Sessions loading aborted');
  //     } else {
  //       console.error('An error occurred while loading sessions', e);
  //       toast.error('Failed to load sessions');
  //     }
  //   }
  // };

  useEffect(() => {
    loadExamModes();
  }, []);

  // useEffect(() => {
  //   if (filters.examYear && visibleFields.includes('sessionId')) {
  //     loadSessions(filters.examYear);
  //   }
  // }, [filters.examYear, visibleFields]);

  // cleanup pending session request on unmount
  useEffect(() => () => {
    try { sessionsAbortController.current?.abort(); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (filters.examModeId) {
      loadExamTypes(filters.examModeId);
    }

    if (filters.examModeId && filters.examTypeId) {
      loadGrades(filters.examModeId, filters.examTypeId);
    }
  }, [filters.examModeId, filters.examTypeId]);

  useEffect(() => {
    if (triggerValidation) {
      trigger(mandatoryKeys);
    }
  }, [triggerValidation, trigger, mandatoryKeys]);

  useEffect(() => {
    if (handleDataChange) {
      handleDataChange(filters);
    }
  }, [filters, handleDataChange]);

  const handleChange = (field, value) => {
    // Immediate fields (except debounced ones)
    if (field !== 'studentName') {
      setFilters((prevState) => ({ ...prevState, [field]: value }));
    } else {
      // Debounced student name update
      if (studentNameDebounceRef.current) {
        clearTimeout(studentNameDebounceRef.current);
      }
      studentNameDebounceRef.current = setTimeout(() => {
        setFilters((prevState) => ({ ...prevState, [field]: value }));
      }, 400); // 400ms debounce delay
    }
    trigger(field);

    if (field === 'examYear' && value) {
      localStorage.setItem('currentYear', value);
    }

    // Clear dependent fields when parent fields change
    if (field === 'examModeId') {
      // Clear exam subject and grade when category changes
      setFilters((prevState) => ({
        ...prevState,
        [field]: value,
        examTypeId: null,
        gradeId: null
      }));
      setValue('examTypeId', null);
      setValue('gradeId', null);
      setExamTypes([]);
      setGrades([]);
    } else if (field === 'examTypeId') {
      // Clear grade when subject changes
      setFilters((prevState) => ({
        ...prevState,
        [field]: value,
        gradeId: null
      }));
      setValue('gradeId', null);
      setGrades([]);
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => () => {
    if (studentNameDebounceRef.current) {
      clearTimeout(studentNameDebounceRef.current);
    }
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper 
        sx={{ 
          p: 3, 
          border: '2px solid #B71D18',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(183, 29, 24, 0.1)',
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 3, 
            color: '#B71D18', 
            fontWeight: 'bold',
            borderBottom: '2px solid #B71D18',
            pb: 2
          }}
        >
          Filter Courses
        </Typography>
        <Grid container spacing={3}>
          {visibleFields.includes('examYear') && (
            <Grid size={{ xs: 4, sm: 4, md: 3 }}>
              <Controller
                name="examYear"
                control={control}
                rules={{ required: mandatoryKeys.includes('examYear') }}
                render={({ field }) => (
                  <Autocomplete
                    fullWidth
                    {...field}
                    options={years?.map((year) => ({
                      label: year?.year,
                      value: year?.year,
                  }))}
                  onChange={(_, value) => {
                    field.onChange(value);
                    handleChange(field.name, value?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Year"
                      size="medium"
                      error={!!errors.examYear}
                      helperText={errors.examYear ? 'Required field' : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#B71D18',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#B71D18',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#B71D18',
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}

        {visibleFields.includes('sessionId') && (
          <Grid size={{ xs: 4, sm: 4, md: 3 }}>
            <Controller
              name="sessionId"
              control={control}
              rules={{ required: mandatoryKeys.includes('sessionId') }}
              render={({ field }) => (
                <Autocomplete
                  fullWidth
                  {...field}
                  options={sessions.map((session) => ({
                    label: session?.sessionName,
                    value: session?.sessionId,
                  }))}
                  onChange={(_, value) => {
                    field.onChange(value);
                    handleChange(field.name, value?.value);
                  }}
                  disabled={!filters.examYear}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Session"
                      size="medium"
                      error={!!errors.sessionId}
                      helperText={errors.sessionId ? 'Required field' : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#B71D18',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#B71D18',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#B71D18',
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}

        {visibleFields.includes('examModeId') && (
          <Grid size={{ xs: 4, sm: 4, md: 3 }}>
            <Controller
              name="examModeId"
              control={control}
              rules={{ required: mandatoryKeys.includes('examModeId') }}
              render={({ field }) => (
                <Autocomplete
                  fullWidth
                  {...field}
                  options={examModes.map((type) => ({
                    label: type?.description,
                    value: type?.examinationModeId,
                  }))}
                  onChange={(_, value) => {
                    field.onChange(value);
                    handleChange(field.name, value?.value);
                  }}
                  disabled={configMode === 'FREEZED'}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Exam Category"
                      size="medium"
                      error={!!errors.examModeId}
                      helperText={errors.examModeId ? 'Required field' : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#B71D18',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#B71D18',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#B71D18',
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}
        {visibleFields.includes('examTypeId') && (
          <Grid size={{ xs: 4, sm: 4, md: 3 }}>
            <Controller
              name="examTypeId"
              control={control}
              rules={{ required: mandatoryKeys.includes('examTypeId') }}
              render={({ field }) => (
                <Autocomplete
                  disabled={!filters.examModeId || configMode === 'FREEZED'}
                  fullWidth
                  {...field}
                  options={examTypes.map((type, index) => ({
                    label: type?.description,
                    value: type?.examinationTypeId,
                    mode: type?.mode,
                  }))}
                  onChange={(_, value) => {
                    field.onChange(value);
                    handleChange(field.name, value?.value);
                  }}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{
                        borderLeft:
                          option.mode === 'PRACTICAL'
                            ? '4px solid #6A0066'
                            : '4px solid #FF0066',
                        paddingLeft: '12px',
                      }}
                    >
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Exam Subject"
                      size="medium"
                      error={!!errors.examTypeId}
                      helperText={errors.examTypeId ? 'Required field' : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#B71D18',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#B71D18',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#B71D18',
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}
        {visibleFields.includes('gradeId') && (
          <Grid size={{ xs: 4, sm: 4, md: 3 }}>
            <Controller
              name="gradeId"
              control={control}
              rules={{ required: mandatoryKeys.includes('gradeId') }}
              render={({ field }) => (
                <Autocomplete
                  disabled={!filters.examTypeId || configMode === 'FREEZED'}
                  fullWidth
                  {...field}
                  options={grades.map((type) => ({
                    label: type?.description,
                    value: type?.gradeId,
                  }))}
                  onChange={(_, value) => {
                    field.onChange(value);
                    handleChange(field.name, value?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Exam Level/Grade"
                      size="medium"
                      error={!!errors.gradeId}
                      helperText={errors.gradeId ? 'Required field' : ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: '#B71D18',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#B71D18',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#B71D18',
                        },
                      }}
                    />
                  )}
                />
              )}
            />
          </Grid>
        )}

        {visibleFields.includes('studentName') && (
          <Grid size={{ xs: 4, sm: 4, md: 3 }}>
            <Controller
              name="studentName"
              control={control}
              rules={{ required: mandatoryKeys.includes('studentName') }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  {...field}
                  label="Student Name"
                  size="medium"
                  error={!!errors.studentName}
                  helperText={errors.studentName ? 'Required field' : ''}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange('studentName', e.target.value);
                  }}
                  InputProps={{
                    endAdornment: field.value && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            field.onChange({ target: { value: '' } });
                            handleChange('studentName', '');
                            setValue('studentName', '');
                          }}
                          edge="end"
                        >
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#B71D18',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#B71D18',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#B71D18',
                    },
                  }}
                />
              )}
            />
          </Grid>
        )}
      </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default SessionsFilter;