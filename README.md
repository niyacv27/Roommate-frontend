# RoomMate Radar - Frontend

React + Tailwind CSS frontend prototype for the final MERN self-project.

## Technologies

- React
- React Router
- Tailwind CSS
- HTML5
- CSS3
- Axios (dependency ready for backend API integration)
- SweetAlert2
- Context API for frontend state
- No Redux / Redux Toolkit
- No Lucide React or other icon library

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Demo login

- Admin: admin@roommateradar.com
- Lister: lister@example.com
- Normal user: user@example.com
- Any password works in this frontend-only prototype.

## Modules

### 1. Admin
- Centralized access
- View users
- Review room submissions
- Approve/reject room listings
- Dashboard statistics

### 2. Room Lister
- Register/login as lister
- Post room
- Enter room details
- Specify roommate requirements
- See listing approval status

### 3. Normal User
- Search approved rooms
- Filter by keyword, city, type and rent
- View room details
- Send roommate interest
- View compatibility-style roommate suggestions
- Start token deposit flow

## Backend integration later

The current frontend uses localStorage/sessionStorage so it can be demonstrated without a backend.

The final MERN backend can replace these mock operations with:
- JWT authentication
- bcrypt password encryption
- RBAC middleware
- MongoDB room/user/request collections
- Server-side pagination
- WebSocket notifications
- Email notifications
- Razorpay/Stripe payment verification
- Activity logs
- Comments and ratings
- CSV/PDF/Excel import/export
- API search/filter/sort
