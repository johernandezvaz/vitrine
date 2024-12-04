# Vitrine - Platform for Service Providers and Clients

Vitrine is a modern web-based platform that connects service providers with clients, facilitating project management, document sharing, and communication in a secure and intuitive environment.

## Features

- **User Authentication**
  - Secure login and registration system
  - Role-based access (Client/Provider)
  - JWT-based authentication

- **Project Management**
  - Create and manage projects
  - Real-time status updates
  - Document upload and verification
  - Progress tracking

- **Communication**
  - Direct messaging between clients and providers
  - Project updates and notifications
  - Document sharing capabilities

- **Dashboard**
  - Custom calendar integration
  - Project statistics and analytics
  - Recent activities tracking
  - Quick access to important features

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation
- Zustand for state management
- Axios for API requests

### Backend
- Flask (Python)
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests
- Supabase for database and storage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vitrine.git
cd vitrine
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up the Python virtual environment:
```bash
python -m venv server/venv
source server/venv/bin/activate  # On Windows: server\venv\Scripts\activate
cd server
pip install -r requirements.txt
```

4. Create a `.env` file in the server directory with your Supabase credentials:
```env
SECRET_KEY=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET_KEY=your_jwt_secret
```

### Running the Application

1. Start the backend server:
```bash
cd server
python app.py
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
vitrine/
├── src/
│   ├── api/           # API integration
│   ├── components/    # Reusable components
│   ├── context/       # React context
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Page components
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── server/
│   ├── app.py         # Flask application
│   ├── config.py      # Server configuration
│   └── requirements.txt
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [Supabase](https://supa
