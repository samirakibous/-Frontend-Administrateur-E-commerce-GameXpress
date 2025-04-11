import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRoute from './components/AuthRoute'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import Layout from './components/Layout';
import Users from './pages/Users';
import { UserProvider } from './context/UserContext';
import Categories from './pages/Categories';
import { CategoryProvider } from './context/CategoryContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <CategoryProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
          
            <Route element={<AuthRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            
            <Route path="unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute roles={['product_manager', 'super_admin']} />}>
              <Route path="dashboard" element={<Dashboard />} />
            
            </Route>
            
            <Route element={<ProtectedRoute roles={['super_admin']} />}>
              <Route path="categories" element={<Categories/>} />
              <Route path="Users" element={<Users/>} />

            </Route>
            
            <Route element={<ProtectedRoute roles={['product_manager', 'super_admin']} />}>
              <Route path="products" element={<div>Products Management</div>} />
            </Route>
          </Route>
          <Route path="*" element={<div>404</div>} />
        </Routes>
        </CategoryProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;