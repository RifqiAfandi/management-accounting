import React from 'react';

// Loading Component
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`loading-spinner animate-spin ${sizeClasses[size]} ${className}`} 
         role="status" 
         aria-label="Loading">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'md' ? `btn-${size}` : '';
  
  return (
    <button
      type={type}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
};

// Card Component
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

// Input Component
export const Input = ({ 
  label, 
  error, 
  id, 
  required = false,
  className = '',
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="text-error-600 ml-1" aria-label="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`form-input ${error ? 'border-error-500' : ''} ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <div id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'primary', className = '', ...props }) => {
  return (
    <span className={`badge badge-${variant} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Table Components
export const Table = ({ children, className = '', ...props }) => {
  return (
    <div className="table-container">
      <table className={`table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children, className = '', ...props }) => {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
};

export const TableBody = ({ children, className = '', ...props }) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = '', ...props }) => {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, header = false, className = '', ...props }) => {
  const Component = header ? 'th' : 'td';
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
};

// Empty State Component
export const EmptyState = ({ 
  title = "No data available", 
  description = "There's nothing to show here yet.", 
  action, 
  className = '' 
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="text-gray-400 text-4xl mb-4">📄</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {action && action}
    </div>
  );
};

// Error State Component
export const ErrorState = ({ 
  title = "Something went wrong", 
  description = "An error occurred while loading the data.", 
  action, 
  className = '' 
}) => {
  return (
    <div className={`error-state ${className}`}>
      <div className="text-error-400 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-error-700 mb-2">{title}</h3>
      <p className="text-error-600 mb-4">{description}</p>
      {action && action}
    </div>
  );
};

// Loading State Component
export const LoadingState = ({ 
  title = "Loading...", 
  description = "Please wait while we fetch your data.", 
  className = '' 
}) => {
  return (
    <div className={`loading-state ${className}`}>
      <LoadingSpinner size="lg" className="mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

// Page Header Component
export const PageHeader = ({ 
  title, 
  description, 
  actions, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-2">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-col sm:flex-row gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

// Stats Card Component
export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendDirection, 
  className = '' 
}) => {
  const trendColor = trendDirection === 'up' ? 'text-success-600' : 
                     trendDirection === 'down' ? 'text-error-600' : 'text-gray-500';
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trendColor}`}>
            {trendDirection === 'up' && '↗'}
            {trendDirection === 'down' && '↙'}
            {trend}
          </div>
        )}
      </div>
    </Card>
  );
};

// Container Component
export const Container = ({ children, className = '', ...props }) => {
  return (
    <div className={`container ${className}`} {...props}>
      {children}
    </div>
  );
};
