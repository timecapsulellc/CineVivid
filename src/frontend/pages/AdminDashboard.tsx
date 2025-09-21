import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const AdminDashboard: React.FC = () => {
  // Mock data
  const stats = {
    totalUsers: 1250,
    totalVideos: 3450,
    activeSessions: 89,
    systemHealth: 'Good',
  };

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', videos: 12 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', videos: 8 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', videos: 15 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5" component="h2">
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Videos
              </Typography>
              <Typography variant="h5" component="h2">
                {stats.totalVideos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Sessions
              </Typography>
              <Typography variant="h5" component="h2">
                {stats.activeSessions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                System Health
              </Typography>
              <Typography variant="h5" component="h2" color="success.main">
                {stats.systemHealth}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Management Table */}
      <Typography variant="h5" component="h2" gutterBottom>
        Recent Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Videos Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell align="right">{user.videos}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminDashboard;