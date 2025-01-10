# Image Editor with Stability AI

A full-stack Next.js application that integrates Stability AI's Edit Image API to provide powerful image editing capabilities.

## Features

- **Image Editing**
  - Erase objects
  - Search and replace objects
  - Search and recolor objects
  - Remove background
  - Replace background and relight

- **User Management**
  - User authentication
  - Save edited images
  - View editing history

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Processing**: Stability AI API
- **Image Storage**: Cloudinary
- **State Management**: Zustand

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stability AI API key
- Cloudinary account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/edit_image"

# Next Auth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stability AI
STABILITY_API_KEY="your-stability-api-key"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/edit-image.git
cd edit-image
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

### Stability AI Endpoints

The application uses the following Stability AI endpoints:

- `POST /api/v1/generation/image-to-image`: For image editing
- `POST /api/v1/generation/image-to-image/masking`: For object removal
- `POST /api/v1/generation/image-to-image/upscale`: For image enhancement

For more details, refer to the [Stability AI API Documentation](https://platform.stability.ai/docs/api-reference#tag/Edit).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 