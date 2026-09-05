# CloudNova — Frontend

CloudNova is a cloud storage web app (like a mini Google Drive) — upload, organize into folders, search, share links, and restore from trash. This repo is the **frontend**, built with React + Vite + Tailwind CSS. It talks to a separate backend API (repo linked below).

🔗 Backend repo: [(https://github.com/GopikaR07/Cloud_Storage_Backend.git) <!-- add link once you share it -->]


<img width="1887" height="856" alt="image" src="https://github.com/user-attachments/assets/94cdfe56-7d73-4158-9134-645c3d41f0d2" />


<img width="1906" height="952" alt="image" src="https://github.com/user-attachments/assets/c909866b-bbe0-46fd-82e8-bda674913820" />


## Features

- **Auth** — Login / Signup pages
- **My Files** — browse files and folders, breadcrumb navigation
- **Folders** — create, navigate into, and organize nested folders
- **Upload** — drag-and-drop upload with progress
- **File versions** — view/restore previous versions of a file
- **Search** — search across your files
- **Share** — generate shareable public links (`/shared/:token`) for files
- **Trash** — soft-delete files/folders, restore or permanently delete

## Tech Stack

- [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [lucide-react](https://lucide.dev/) for icons

## Project Structure

```
src/
├── api.js              # API base config
├── App.jsx             # routes
├── pages/              # Login, Signup, Dashboard, SharedLink
├── components/         # Sidebar, Header, FileCard, FolderCard, UploadDropzone, etc.
├── services/           # API calls
└── assets/
```

## Getting Started

### Prerequisites
- Node.js 18+
- The [backend](#) running locally or deployed

### Setup

```bash
git clone https://github.com/GopikaR07/Cloud_Storage_Frontend.git
cd Cloud_Storage_Frontend
npm install
```

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:5000   # or your deployed backend URL
```

Run the dev server:

```bash
npm run dev
```

### Other scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## License

This project is for personal/academic use.
