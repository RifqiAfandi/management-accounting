# Management System Accounting - Frontend

Frontend aplikasi untuk sistem manajemen akuntansi menggunakan React + Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm atau yarn
- Backend API running di `http://localhost:3000`

### Installation

1. **Install dependencies**
   ```powershell
   cd management-system-accounting-fe
   npm install
   ```

2. **Start Development Server**
   ```powershell
   npm run dev
   ```

Aplikasi akan berjalan di `http://localhost:5173`

## 🔐 Login

### Demo Account
- **Username**: `admin`
- **Password**: `admin123`

## ✨ Features

### 🏠 Dashboard
- Welcome page dengan statistik overview
- Modern dan responsive design

### 📊 Traffic & Customer
- View data traffic dan customer per shift
- Filter berdasarkan tanggal
- Navigasi previous/next day
- Summary statistics
- Responsive table dengan pagination

### 🎨 Design System
- Consistent color palette
- Professional typography
- Smooth animations & transitions
- Mobile-first responsive design

## 📁 Project Structure

```
src/
├── features/
│   ├── auth/              # Login page & authentication
│   ├── dashboard/         # Dashboard components
│   ├── pages/            # Application pages
│   ├── sidebar/          # Navigation sidebar
│   └── mainContent/      # Main content area
├── utils/                # Utility functions (icons, etc)
├── constants/           # Application constants
└── theme.css           # Design system variables
```

## 🛠 Available Scripts

```powershell
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Secondary**: Indigo (#6366f1)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Neutral**: Gray scale (#f9fafb to #111827)

### Typography
- **Font Family**: System fonts (Apple, Segoe UI, Roboto)
- **Scale**: Consistent spacing and sizing
- **Weight**: 400 (normal) to 700 (bold)

### Components
- Modern card layouts
- Professional form controls
- Interactive buttons with hover states
- Loading states & error handling
- Responsive navigation

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

Semua komponen fully responsive dengan mobile-first approach.

## 🔧 Configuration

### API Base URL
Default: `http://localhost:3000/api`

Untuk mengubah, edit di file komponen yang relevant atau buat environment configuration.

### Vite Configuration
- Hot Module Replacement (HMR)
- Fast development builds
- Optimized production builds

## 🚀 Deployment

### Build for Production
```powershell
npm run build
```

Output akan tersedia di folder `dist/`.

### Preview Production Build
```powershell
npm run preview
```

## 🔒 Authentication

- JWT token-based authentication
- Automatic token refresh handling
- Protected routes
- Persistent login state

Token disimpan di `localStorage` dan otomatis disertakan dalam API requests.

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Pastikan backend running di port 3000
   - Cek CORS configuration
   - Verify network connectivity

2. **Login Failed**
   - Cek username/password
   - Pastikan backend database seeded
   - Check browser console for errors

3. **Build Errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Update dependencies: `npm update`

---

**Tech Stack**: React 18, Vite, Modern CSS, JWT Authentication

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
#   U p d a t e   R E A D M E 
 
 