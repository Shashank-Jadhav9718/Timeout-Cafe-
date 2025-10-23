# Cafe Bloom Control

A modern React application built with TypeScript, Vite, and shadcn/ui components for cafe management and control systems.

## Project info

**URL**: https://lovable.dev/projects/3ff4b6d8-8cfc-4153-b16b-60c29ab914dc

## 🚀 Detailed Setup Guide - Running Locally

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js (v18.17.0 or higher)**
   - Go to [nodejs.org](https://nodejs.org/)
   - Download the LTS version (the project requires Node.js ≥18.17.0)
   - Run the installer and follow the setup wizard
   - Verify installation by opening terminal/command prompt and typing:
     ```bash
     node --version  # Should show v18.17.0 or higher
     npm --version   # Should show v9.6.0 or higher
     ```

2. **Git**
   - Go to [git-scm.com](https://git-scm.com/)
   - Download and install Git
   - Verify installation:
     ```bash
     git --version
     ```

3. **Code Editor (Recommended)**
   - [Visual Studio Code](https://code.visualstudio.com/) - Free and popular
   - Or any text editor of your choice

### Step-by-Step Installation

#### Step 1: Get the Project Files

**Option A: If you already have the project folder**
- Navigate to your project folder: `c:\Users\Orca\Desktop\Cafe\cafe-bloom-control`
- Open terminal/command prompt in this folder

**Option B: If cloning from Git**
```bash
# Open terminal/command prompt
# Navigate to where you want the project
cd Desktop
git clone <YOUR_GIT_URL>
cd cafe-bloom-control
```

#### Step 2: Verify Node.js Version (Automatic)

The project includes version management files that help ensure you're using the correct Node.js version:

**If you have nvm (Node Version Manager) installed:**
```bash
# This will automatically use Node.js 18.17.0
nvm use
```

**If you don't have nvm, manually check your version:**
```bash
node --version  # Must be 18.17.0 or higher
```

#### Step 3: Install Project Dependencies

Open terminal/command prompt in the project folder and run:

**Using npm (comes with Node.js):**
```bash
npm install
```

**Or using bun (faster alternative):**
```bash
# First install bun globally
npm install -g bun
# Then install dependencies
bun install
```

This will create a `node_modules` folder with all required packages.

#### Step 4: Configure Environment Variables

1. **Copy the environment template:**
   ```bash
   # On Windows Command Prompt:
   copy .env.example .env
   
   # On Windows PowerShell:
   Copy-Item .env.example .env
   
   # On Mac/Linux:
   cp .env.example .env
   ```

2. **Edit the .env file:**
   - Open `.env` file in your code editor
   - You'll see these lines:
     ```
     VITE_SUPABASE_PROJECT_ID="your_supabase_project_id"
     VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
     VITE_SUPABASE_URL="https://your_project_id.supabase.co"
     ```
   
3. **Get your Supabase credentials:**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project
   - Go to Settings → API
   - Copy the values and replace in your `.env` file:
     ```
     VITE_SUPABASE_PROJECT_ID="ndgmkbqgnfaqppxcrxdj"
     VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     VITE_SUPABASE_URL="https://ndgmkbqgnfaqppxcrxdj.supabase.co"
     ```

#### Step 5: Start the Development Server

In your terminal/command prompt, run:

**Using npm:**
```bash
npm run dev
```

**Using bun:**
```bash
bun run dev
```

You should see output like:
```
  VITE v5.4.19  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### Step 6: Open Your Application

1. **Open your web browser**
2. **Navigate to:** `http://localhost:5173`
3. **You should see your Cafe Bloom Control application running!**

### Troubleshooting Common Issues

#### Issue: "npm is not recognized"
- **Solution:** Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- Make sure to restart your terminal after installation

#### Issue: "Port 5173 is already in use"
- **Solution:** Either:
  - Close other applications using that port
  - Or Vite will automatically use the next available port (5174, 5175, etc.)

#### Issue: Environment variables not working
- **Solution:** 
  - Make sure your `.env` file is in the root directory (same level as `package.json`)
  - Restart the development server after changing `.env`
  - Check that variable names start with `VITE_`

#### Issue: Dependencies installation fails
- **Solution:**
  - Delete `node_modules` folder and `package-lock.json`
  - Run `npm install` again
  - Or try using `npm ci` instead

### Making Changes to the Code

1. **Open the project in your code editor**
2. **Main files to edit:**
   - `src/` folder - Contains all React components
   - `src/App.tsx` - Main application component
   - `src/components/` - Reusable UI components
   - `src/pages/` - Different pages/views

3. **The development server will automatically reload when you save changes**

### Available Scripts

- `npm run dev` / `bun run dev` - Start development server
- `npm run build` / `bun run build` - Build for production
- `npm run build:dev` / `bun run build:dev` - Build for development
- `npm run preview` / `bun run preview` - Preview production build
- `npm run lint` / `bun run lint` - Run ESLint

### Environment Variables

This project requires the following environment variables (see `.env.example`):

- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable key
- `VITE_SUPABASE_URL` - Your Supabase project URL

### 🐳 Docker Support (Optional)

The project includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t cafe-bloom-control .

# Run Docker container
docker run -p 5173:5173 cafe-bloom-control
```

### 📦 Dependency Management

The project includes several dependency management files:

- **`package.json`** - Main dependency configuration with version requirements
- **`.nvmrc`** - Node.js version specification for nvm users
- **`.node-version`** - Alternative Node.js version file
- **`DEPENDENCIES.md`** - Comprehensive dependency documentation

For detailed dependency information, see the [DEPENDENCIES.md](./DEPENDENCIES.md) file.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3ff4b6d8-8cfc-4153-b16b-60c29ab914dc) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

Follow the installation steps above to get started locally.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3ff4b6d8-8cfc-4153-b16b-60c29ab914dc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
