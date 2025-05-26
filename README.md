Here’s a detailed `README.md` for your **PDF Management & Collaboration** project — including features, setup, technologies, architecture, deployment, and more:

---

```markdown
# 📄 pdfgo — PDF Management & Collaboration Platform

pdfgo is a modern, secure, and collaborative PDF management tool designed for tutors, educators, and teams. Users can upload PDFs, store them securely on UploadThing, view and manage them from a dashboard, and share them via unique links.

---

## 🚀 Features

- ✅ Secure login with JWT-based auth (Access & Refresh tokens)
- ✅ Upload PDFs to UploadThing CDN
- ✅ View personal PDF library on the dashboard
- ✅ Delete PDFs (including from UploadThing & DB)
- ✅ Share PDFs via unique links
- ✅ Commenting system per PDF
- ✅ Protected routes via Edge Middleware
- ✅ Client state with Redux Toolkit
- ✅ Realtime dashboard revalidation

---

## 🛠️ Tech Stack

| Layer        | Stack                                                                 |
|--------------|-----------------------------------------------------------------------|
| Frontend     | Next.js 14 (App Router), React, Tailwind CSS                          |
| State Mgmt   | Redux Toolkit (Auth & Session Info)                                   |
| Backend API  | Next Server Actions                                                   |
| Database     | PostgreSQL with Prisma ORM                                            |
| File Storage | [UploadThing](https://uploadthing.com)                                |
| Auth         | JWT                                   |
| DevOps       | Docker, Docker Compose, WSL2                                          |
| Deployment   | Vercel (Frontend) + Neon + UploadThing (Backend + DB + CDN)                    |



---

## 🔐 Authentication Flow

- `login()`:
  - Verifies credentials
  - Sends tokens to client via response and Redux state

- Edge `middleware.ts`:
  - Protects all `/dashboard`, `/pdf/*`, `/api/upload` routes
  - Verifies JWT from `cookies().get('accessToken')`

---

## 🧾 PDF Upload Flow

1. User uploads a `.pdf` via `FileUploadForm`
2. File is sent to UploadThing CDN
3. URL is saved to PostgreSQL DB
4. Page is revalidated and PDF appears on dashboard

```ts
// uploadPdf.ts
const publicUrl = await uploadToUploadThing(file);
await prisma.pdf.create({ data: { path: publicUrl, ownerId: userId } });
````

---

## 🧼 PDF Delete Flow

* Checks for PDF ownership
* Deletes dependent `comments`, `shareLinks`
* Deletes PDF from UploadThing (via `UTApi`)
* Deletes PDF from database

```ts
await prisma.comment.deleteMany({ where: { pdfId } });
await utapi.deleteFiles([pdf.path]);
await prisma.pdf.delete({ where: { id: pdfId } });
```

---

## 🌍 Deployment

### 📦 Frontend (Next.js)

* Deployed on **Vercel**
* Environment variables set via Vercel dashboard

### 🔧 Backend + DB

* Deployed using **Neon** with:

  * PostgreSQL
  * Prisma

### 🐳 Docker (Local Dev)

```bash
docker-compose up --build
```

---

## 🧪 Local Setup

### Prerequisites

* Node.js ≥ 18
* Docker
* PostgreSQL & Prisma (local or Docker)
* `.env` file

### .env (example)

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/pdfgo
JWT_SECRET=your-super-secret
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000"
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```


---

## 📎 Useful Commands

```bash
# Prisma
npx prisma generate
npx prisma migrate dev

# Dev server
npm run dev

```

---

## 🤝 Contributing

PRs and feedback welcome! Please open an issue for bugs or ideas.

---

## 🔒 License

MIT License © 2025 \[Your Name / Org]

---

## 📫 Contact

For questions, reach out via:

* Email: [ayushkedia1990@gmail.com](mailto:ayushkedia1990@gmail.com)

