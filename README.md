# TubeNote

![TubeNote Logo](./frontend/public/images/logo-3.png)

## Introduction

TubeNote is a web application designed to transform how people learn from YouTube videos. It seamlessly integrates video watching with intelligent note-taking capabilities, creating an enhanced learning experience for students, professionals, and lifelong learners.

- **Deployed Site:** [https://tubenote.vercel.app](https://tubenote.vercel.app)
- **Project Blog Article:** [TubeNote: Revolutionizing Video Learning](https://medium.com/@ismaillhbibe/tubenote-revolutionizing-video-learning-d17f12505eee)
- **Author's LinkedIn:** [https://www.linkedin.com/in/lahbiyebismail/](https://www.linkedin.com/in/lahbiyebismail/)

## Features

- Synchronized Note-Taking: Create time-stamped notes linked to specific moments in YouTube videos.
- Smart Search: Quickly find relevant notes and video segments.
- Cross-Device Synchronization: Access your notes and video progress across multiple devices.

## Installation

To set up TubeNote locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/yourusername/tubenote.git
```

2. Navigate to the project directory:

```
cd tubenote
```

3. Install dependencies for the root directory:

```
yarn install or npm install
```

4. Install dependencies for the backend directory:

```
cd backend

yarn install or npm install
```

5. Install dependencies for the frontend directory:

```
cd frontend

yarn install or npm install
```

6. Set up environment variables for the backend directory:
- Create a `.env` file in the backend directory
- Add the following variables:
  ```
  PORT=8080
  YOUTUBE_API_KEY=your_youtube_api_key
  DATABASE_URL=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_string
  YOUTUBE_API_URL="https://www.googleapis.com/youtube/v3/videos?id="
  ```

7. Set up environment variables for the frontend directory:
- Create a `.env.local` file in the frontend directory
- Add the following variables:
  ```
  NEXT_PUBLIC_API_URL="http://localhost:8080/api/v1"
  KINDE_CLIENT_ID=your_kinde_client_id
  KINDE_CLIENT_SECRET=your_kinde_client_secret
  KINDE_ISSUER_URL=your_kinde_issuer_url
  KINDE_SITE_URL=your_kinde_site_url
  KINDE_POST_LOGOUT_REDIRECT_URL=your_kinde_logout_redirect_url
  KINDE_POST_LOGIN_REDIRECT_URL=your_kinde_login_redirect_url
  ```

8. Run the development server:

```
yarn start:dev or npm run start:dev
```

9. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Sign up or log in to your TubeNote account.
2. Paste a YouTube video URL into the search bar.
3. As the video plays, click the "Add Note" button to create a note.
4. Access your notes from any device by logging into your account.

<!-- For more detailed instructions, please refer to our [User Guide](link-to-user-guide).

## Contributing

We welcome contributions to TubeNote! Here's how you can help:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Submit a pull request.

Please read [CONTRIBUTING.md](link-to-contributing-file) for details on our code of conduct and the process for submitting pull requests. -->

## Related Projects

- [YouTube Data API](https://developers.google.com/youtube/v3) - Used for interacting with YouTube videos.
- [Next.js](https://nextjs.org/) - The React framework used for building the application.
- [Prisma](https://www.prisma.io/) - ORM used for database operations.

## License

This project is licensed under the MIT License - see the [LICENSE.md](link-to-license-file) file for details.

## Acknowledgments

- Thanks to all the open-source libraries and tools that made this project possible.
- Special thanks to the YouTube Developer community for their invaluable resources and support.
