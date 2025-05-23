import { AuthProvider } from './features/auth/AuthContext';
import Router from './routes/Router';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;