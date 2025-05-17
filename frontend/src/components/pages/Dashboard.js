import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  getUserGoals,
  getPublicGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  updateProgress,
  toggleLike,
} from '../../store/slices/goalSlice';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const categories = [
  'Travel',
  'Skills',
  'Adventure',
  'Personal',
  'Career',
  'Health',
  'Other',
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { userGoals, publicGoals, loading } = useSelector((state) => state.goals);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    deadline: '',
    isPublic: true,
  });

  useEffect(() => {
    dispatch(getUserGoals());
    dispatch(getPublicGoals());
  }, [dispatch]);

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setSelectedGoal(goal);
      setFormData({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        isPublic: goal.isPublic,
      });
    } else {
      setSelectedGoal(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        deadline: '',
        isPublic: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGoal(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedGoal) {
      dispatch(updateGoal({ id: selectedGoal._id, goalData: formData }));
    } else {
      dispatch(createGoal(formData));
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      dispatch(deleteGoal(id));
    }
  };

  const handleProgressUpdate = (id, progress) => {
    dispatch(updateProgress({ id, progress }));
  };

  const handleLike = (id) => {
    dispatch(toggleLike(id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* My Goals Section */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h4" component="h1">
              My Bucket List
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Goal
            </Button>
          </Box>
        </Grid>

        {/* Goals Grid */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {userGoals.map((goal) => (
              <Grid item xs={12} sm={6} key={goal._id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" component="h2">
                        {goal.title}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(goal)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(goal._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography color="text.secondary" gutterBottom>
                      {goal.description}
                    </Typography>
                    <Chip
                      label={goal.category}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={goal.progress}
                        sx={{ mb: 1 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {goal.progress}%
                        </Typography>
                        <Button
                          size="small"
                          onClick={() => handleProgressUpdate(goal._id, goal.progress + 10)}
                          disabled={goal.progress >= 100}
                        >
                          Update Progress
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Map Section */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Goal Locations
              </Typography>
              <Box sx={{ height: 400 }}>
                <MapContainer
                  center={[0, 0]}
                  zoom={2}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {userGoals
                    .filter((goal) => goal.location?.coordinates)
                    .map((goal) => (
                      <Marker
                        key={goal._id}
                        position={goal.location.coordinates}
                      >
                        <Popup>
                          <Typography variant="subtitle1">{goal.title}</Typography>
                          <Typography variant="body2">{goal.description}</Typography>
                        </Popup>
                      </Marker>
                    ))}
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Public Goals Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Inspiration from Others
          </Typography>
          <Grid container spacing={2}>
            {publicGoals.map((goal) => (
              <Grid item xs={12} sm={6} md={4} key={goal._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {goal.title}
                    </Typography>
                    <Typography color="text.secondary" gutterBottom>
                      {goal.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip
                        label={goal.category}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleLike(goal._id)}
                      >
                        {goal.likes.includes(goal.user._id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Add/Edit Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedGoal ? 'Edit Goal' : 'Add New Goal'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedGoal ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 