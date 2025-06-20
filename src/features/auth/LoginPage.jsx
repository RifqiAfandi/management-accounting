import React, { useState } from 'react';

const LoginPage = ({ onLogin, authError, loading }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      return;
    }
    if (!password.trim()) {
      return;
    }
    
    onLogin(email.trim(), password);
  };

  const handleDemoLogin = () => {
    setEmail('admin@example.com');
    setPassword('admin123');
    if (onLogin) {
      onLogin('admin@example.com', 'admin123');
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Sistem Akuntansi Management</h2>
        <p>Silakan login untuk mengakses sistem</p>
        
        {authError && (
          <div className="error-message" role="alert" aria-live="polite">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              aria-describedby={authError ? "error-message" : undefined}
              placeholder="Masukkan email Anda"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                aria-describedby={authError ? "error-message" : undefined}
                placeholder="Masukkan password Anda"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                disabled={loading}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? 'Sedang login...' : 'Login'}
          </button>
        </form>
    
      </div>
    </div>
  );
};

export default LoginPage;
