import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Container, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Dashboard as DashboardIcon, ShoppingCart, People, BarChart } from '@mui/icons-material';
import api from '../api/axios';
import Sidebar from '../components/sidebar';
import axios from 'axios';
const Dashboard = () => {

  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  
  // useEffect(() => {
    // Simulate loading data
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        const response = await api.get('/admin/dashboard', config);
        console.log(response.data);
        setDashboardData(response.data.data);
        setLoading(false); 
      } catch (error) {
        console.error('Erreur lors de la récupération des données du tableau de bord:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
  
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Welcome back, {user.user.name}
            </Typography>
  
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="textSecondary" gutterBottom>
                        Total Products
                      </Typography>
                      <ShoppingCart color="primary" />
                    </Box>
                    <Typography variant="h5">{dashboardData?.total_products}</Typography>
                  </CardContent>
                </Card>
              </Grid>
  
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="textSecondary" gutterBottom>
                        Total Users
                      </Typography>
                      <People color="primary" />
                    </Box>
                    <Typography variant="h5">{dashboardData?.total_users}</Typography>
                  </CardContent>
                </Card>
              </Grid>
  
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="textSecondary" gutterBottom>
                        Total categories
                      </Typography>
                      <BarChart color="primary" />
                    </Box>
                    <Typography variant="h5">{dashboardData?.total_categories}</Typography>
                  </CardContent>
                </Card>
              </Grid>
  
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="textSecondary" gutterBottom>
                        Total subCatgr
                      </Typography>
                      <DashboardIcon color="primary" />
                    </Box>
                    <Typography variant="h5">{dashboardData?.total_subcategories}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
  
            <Box sx={{ mt: 4 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Typography color="textSecondary">
                    No recent activity
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Container>
        )}
      </Box>
    </Box>
  );
}  
export default Dashboard;