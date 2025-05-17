# BucketListify

BucketListify is a full-stack web application that helps users create, track, and share their bucket list goals. Built with Ruby on Rails and React, it provides a modern and intuitive interface for managing personal goals and connecting with others.

## Features

- User authentication and authorization
- Create, edit, and delete bucket list goals
- Track progress with visual indicators
- Interactive map to visualize goal locations
- Social features (like and share goals)
- Responsive design for all devices

## Tech Stack

### Backend
- Ruby on Rails 7
- PostgreSQL
- JWT for authentication
- RSpec for testing

### Frontend
- React 18
- Redux Toolkit for state management
- Material-UI for components
- React Router for navigation
- Leaflet for maps
- Axios for API requests

## Getting Started

### Prerequisites
- Ruby 3.2.0 or higher
- Node.js 16 or higher
- PostgreSQL
- Yarn or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/badervance/bucketlistify.git
cd bucketlistify
```

2. Set up the backend:
```bash
cd backend
bundle install
rails db:create db:migrate
rails s
```

3. Set up the frontend:
```bash
cd frontend
yarn install
yarn start
```

4. Visit `http://localhost:3000` in your browser

## Development

### Backend Development
- Run tests: `bundle exec rspec`
- Start server: `rails s`
- Console: `rails c`

### Frontend Development
- Start development server: `yarn start`
- Build for production: `yarn build`
- Run tests: `yarn test`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful components
- Leaflet for the mapping functionality
- The Ruby on Rails and React communities for their excellent documentation 