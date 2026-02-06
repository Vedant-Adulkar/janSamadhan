# JanSamadhan - Community Issue Reporting Platform

A full-stack web application for reporting and managing local civic issues like potholes, garbage, water supply, and electricity problems.

![Platform Overview](https://img.shields.io/badge/Status-Ready-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### User Features
- **User Authentication**: Secure registration and login with JWT
- **Report Issues**: Create issues with title, description, category, and image
- **Auto-Geolocation**: Automatically detect and capture location coordinates
- **View Issues**: Browse all reported issues in grid or map view
- **Filter & Search**: Filter by category, status, and search by keywords
- **Issue Details**: View complete issue information with location map
- **Status Tracking**: Track issue status (Reported → In Progress → Fixed)

### Admin Features
- **Admin Dashboard**: Comprehensive overview with statistics
- **Manage Issues**: View and manage all reported issues
- **Update Status**: Change issue status with dropdown selection
- **Add Comments**: Provide updates and comments on issues
- **Analytics**: View issue counts by status and category

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Image storage

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Google Maps API** - Map integration

## 📁 Project Structure

```
JanSamadhan/
├── backend/
│   ├── config/          # Database and Cloudinary config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth and error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── uploads/         # Temporary file storage
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Entry point
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # Auth context
    │   ├── pages/       # Page components
    │   ├── services/    # API service layer
    │   ├── utils/       # Constants and helpers
    │   ├── App.jsx      # Main app component
    │   ├── main.jsx     # Entry point
    │   └── index.css    # Global styles
    ├── .env             # Environment variables
    ├── package.json
    └── vite.config.js
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (free tier)
- Google Maps API key

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `backend/.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/jansamadhan
   JWT_SECRET=your_random_secret_key_here
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the server**
   ```bash
   npm run dev
   ```
   
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Edit `frontend/.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   App will run on `http://localhost:3000`

### Getting API Keys

**Cloudinary:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard

**Google Maps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project
3. Enable Maps JavaScript API
4. Create API key

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Issues
- `GET /api/issues` - Get all issues (with filters)
- `GET /api/issues/:id` - Get single issue
- `GET /api/issues/nearby` - Get nearby issues
- `POST /api/issues` - Create issue (protected)
- `PUT /api/issues/:id` - Update issue (protected)
- `DELETE /api/issues/:id` - Delete issue (protected)

### Admin
- `GET /api/admin/stats` - Get statistics (admin)
- `GET /api/admin/issues` - Get all issues (admin)
- `PUT /api/admin/issues/:id/status` - Update status (admin)
- `POST /api/admin/issues/:id/comment` - Add comment (admin)

## 👤 Creating Admin User

To create an admin user, register normally and then update the role in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "ADMIN" } }
)
```

## 🎨 Features Walkthrough

1. **Register/Login**: Create account or sign in
2. **Report Issue**: Click "Report Issue", fill form, upload image, auto-detect location
3. **View Issues**: Browse in grid view or switch to map view
4. **Filter**: Use category and status filters to find specific issues
5. **View Details**: Click on any issue to see full details
6. **Admin Dashboard**: Admins can update status and add comments

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes on frontend and backend
- Role-based access control
- Input validation
- File upload restrictions (images only, 5MB limit)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for solving real-world civic problems**
