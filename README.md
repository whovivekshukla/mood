# Mood Tracker Web App

This web application utilizes OpenAI GPT APIs to track and analyze your mood based on journal entries. It provides detailed insights, including mood, subject, negativity, summary, color, and sentiment score. Additionally, users can query the web app, asking questions like "How have I been feeling for the past 3 days?" and receive insightful responses.

## Tech Stack

- **NextJS**: The foundation of the web app, providing a fast and efficient React framework.
- **Clerk for Auth**: Enables secure and seamless authentication for users.
- **Tailwind**: A utility-first CSS framework for styling the app with ease.
- **PlanetScale for DB**: Utilized for database management, ensuring scalability and reliability.
- **Prisma ORM**: A powerful tool for database access and manipulation, enhancing data interaction.
- **OpenAI API**: Harnesses the capabilities of OpenAI GPT APIs for mood analysis and responses.

### Getting Started

To run this app, follow these steps:

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Make a copy of the `.env.local.example` file and rename it to `.env.local`. Fill in all the required values.
4. Run `npm run dev`. The app will be available at http://localhost:3000.
