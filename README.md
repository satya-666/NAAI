# BarberConnect - Full-Stack Barber Booking System

A comprehensive web application that connects customers with barbers, allowing for easy appointment booking, real-time wait times, and location-based search.

## 🚀 Features

### For Customers
- **Find Nearby Barbers**: Location-based search with distance calculation
- **Real-time Wait Times**: See current waiting periods at each shop
- **Book Appointments**: Easy booking system with service selection
- **Reviews & Ratings**: Read and leave reviews for barbershops
- **Service Information**: View detailed service lists and pricing

### For Barbers
- **Shop Management**: Create and manage barbershop profiles
- **Service Management**: Add and update services with pricing
- **Booking Management**: View and manage customer appointments
- **Wait Time Updates**: Real-time waiting time management
- **Review Monitoring**: Track customer feedback and ratings

### Technical Features
- **Real-time Updates**: Socket.io integration for live updates
- **Location Services**: Google Maps integration for location search
- **Responsive Design**: Mobile-friendly interface
- **Authentication**: JWT-based secure authentication
- **Image Upload**: Cloudinary integration for photo management

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time features
- **Cloudinary** for image storage
- **Express Validator** for input validation

### Frontend
- **Next.js** (React framework)
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **React Query** for data fetching
- **Socket.io Client** for real-time updates
- **Google Maps API** for location services

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Google Maps API key
- Cloudinary account (optional, for image uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Barber
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Setup

#### Backend (.env)
Create a `.env` file in the `server` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/barberconnect
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Database Setup
Make sure MongoDB is running on your system or use a cloud MongoDB instance.

### 5. Seed Data (Optional)
To populate the database with sample data:
```bash
cd server
npm run seed
```

This will create:
- 3 sample barbers with shops
- 3 sample customers
- Sample bookings and reviews

### 6. Run the Application

#### Development Mode
```bash
# From the root directory
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) concurrently.

#### Individual Services
```bash
# Backend only
cd server
npm run dev

# Frontend only
cd client
npm run dev
```

## 🧪 Demo Accounts

After running the seed script, you can use these demo accounts:

### Barber Accounts
- **Email**: john@barbershop.com
- **Password**: password123

- **Email**: mike@classiccuts.com
- **Password**: password123

- **Email**: carlos@elitebarbers.com
- **Password**: password123

### Customer Accounts
- **Email**: alice@email.com
- **Password**: password123

- **Email**: bob@email.com
- **Password**: password123

- **Email**: sarah@email.com
- **Password**: password123

## 📱 Usage

### For Customers
1. **Register/Login** as a customer
2. **Find Barbers** using the search page
3. **View Shop Details** including services, reviews, and wait times
4. **Book Appointments** by selecting services and time slots
5. **Leave Reviews** after completed appointments

### For Barbers
1. **Register/Login** as a barber
2. **Create Shop Profile** with location, services, and operating hours
3. **Manage Bookings** through the dashboard
4. **Update Wait Times** in real-time
5. **View Reviews** and customer feedback

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Shops
- `GET /api/shops` - Get all shops (with filters)
- `GET /api/shops/:id` - Get shop by ID
- `POST /api/shops` - Create shop (barber only)
- `PUT /api/shops/:id` - Update shop (owner only)
- `PUT /api/shops/:id/waiting-time` - Update wait time

### Bookings
- `POST /api/bookings` - Create booking (customer only)
- `GET /api/bookings/customer/my-bookings` - Get customer bookings
- `GET /api/bookings/shop/:shopId` - Get shop bookings (owner only)
- `PUT /api/bookings/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create review (customer only)
- `GET /api/reviews/shop/:shopId` - Get shop reviews
- `GET /api/reviews/customer/my-reviews` - Get customer reviews

## 🚀 Deployment

### Backend Deployment (Railway/Render/AWS)
1. Set up environment variables
2. Deploy the `server` directory
3. Update `FRONTEND_URL` in environment variables

### Frontend Deployment (Vercel)
1. Connect your GitHub repository
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/.next`
4. Add environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the GitHub repository.

---

**BarberConnect** - Connecting customers with the best barbers in their area! 💇‍♂️✨
# NAAI
