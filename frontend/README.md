AI Code Reviewer Frontend
This is the frontend application for the AI Code Reviewer tool, built with React.js and plain CSS. It provides an interface for users to input code, select a language, trigger AI analysis, and display the results.

Features
Code input area with language selection.

"Analyze Code" button to send code to the backend.

Displays AI-generated analysis including:

Bugs and logic issues

Best practice suggestions

Plain English code explanations

Suggested test cases or docstrings

Light and Dark mode toggle with persisted preference.

Fully responsive design.

Technology Stack
React.js: For building the user interface.

Plain CSS: For all styling, ensuring no external CSS frameworks are used.

Fetch API: For communicating with the backend.

Prerequisites
Node.js (LTS version recommended)

npm (comes with Node.js) or yarn

Installation
Clone the repository:

git clone https://github.com/your-username/ai-code-reviewer.git
cd ai-code-reviewer/frontend

(Replace your-username/ai-code-reviewer.git with your actual repository URL)

Install dependencies:

npm install
# OR
yarn install

Configuration
The frontend needs to know where your backend API is running.

Create a .env file in the frontend/ directory (at the same level as package.json).

Add the following line, replacing the URL with the address of your backend server:



Deployment: When you deploy your backend to Railway or Render, update this URL to your live backend URL.

Running the Frontend Locally
After installing dependencies and configuring the .env file:

npm start
# OR
yarn start


Input Code: Paste a code snippet into the text area.

Select Language: Choose the correct programming language from the dropdown.

Analyze: Click the "Analyze Code" button.

View Results: The analysis results (bugs, suggestions, explanations, test cases) will appear in the output section.

Toggle Theme: Use the "Switch to Dark/Light Mode" button to change the application's theme.

Deployment to Vercel
Create a Vercel Account: If you don't have one, sign up at vercel.com.

Install Vercel CLI (Optional but Recommended):

npm install -g vercel

Connect to Git: Push your frontend directory to a Git repository (e.g., GitHub, GitLab, Bitbucket).

Import Project to Vercel:

Go to your Vercel Dashboard.

Click "Add New..." -> "Project".

Select your Git repository.

Vercel should automatically detect that it's a React project.

Click "Deploy".

Vercel will build and deploy your React application, providing you with a live URL. Any subsequent pushes to your connected Git branch will trigger automatic redeployments.