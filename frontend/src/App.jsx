import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import IssuesList from './pages/IssuesList';
import IssueDetail from './pages/IssueDetail';
import CreateIssue from './pages/CreateIssue';
import AdminDashboard from './pages/AdminDashboard';

/**
 * Main App Component
 * Sets up routing and authentication
 */
function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected routes */}
                        <Route
                            path="/issues"
                            element={
                                <ProtectedRoute>
                                    <IssuesList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/issues/:id"
                            element={
                                <ProtectedRoute>
                                    <IssueDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create-issue"
                            element={
                                <ProtectedRoute>
                                    <CreateIssue />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin only route */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/issues" replace />} />
                        <Route path="*" element={<Navigate to="/issues" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
