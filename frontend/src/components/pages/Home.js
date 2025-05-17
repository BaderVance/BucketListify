import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  EmojiEvents,
  Public,
  Timeline,
  Group,
} from '@mui/icons-material';

const features = [
  {
    icon: <EmojiEvents fontSize="large" color="primary" />,
    title: 'Track Your Goals',
    description: 'Create and manage your bucket list goals with progress tracking and deadlines.',
  },
  {
    icon: <Public fontSize="large" color="primary" />,
    title: 'Global Community',
    description: 'Get inspired by others\' goals and share your achievements with the world.',
  },
  {
    icon: <Timeline fontSize="large" color="primary" />,
    title: 'Visual Progress',
    description: 'See your progress with beautiful charts and a world map of your adventures.',
  },
  {
    icon: <Group fontSize="large" color="primary" />,
    title: 'Collaborate',
    description: 'Team up with friends to achieve shared goals and create lasting memories.',
  },
];

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Your Dreams, Your Bucket List
          </Typography>
          <Typography variant="h5" paragraph>
            Track your life goals, get inspired, and achieve your dreams with BucketListify.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ mt: 2 }}
          >
            Start Your Journey
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Your Adventure?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Join thousands of dreamers and achievers on BucketListify today.
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
          >
            Create Your Bucket List
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 