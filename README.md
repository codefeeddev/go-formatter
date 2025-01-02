# Go Code Formatter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcodefeeddev%2Fgo-formatter)

A modern, web-based Go code formatter with real-time formatting capabilities. Format your Go code instantly with a clean, user-friendly interface.

![Go Code Formatter Screenshot](/public/screenshot.png)

## ✨ Features

- 🚀 Real-time code formatting
- 🎨 Multiple editor themes (Default, Monokai, GitHub, Dracula)
- 📏 Optional line numbers
- 💾 Code sharing with 24-hour persistence
- ↩️ Undo/Redo functionality
- 💻 Responsive design
- 🌓 Light/Dark mode
- 📱 Mobile-friendly
- 🔄 Local storage persistence
- 📋 Copy to clipboard
- ⬇️ Download formatted code
- 📤 Share via URL or QR code

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Go 1.16+ (for local API server)
- Vercel account (for deployment)

### Development Setup

1. Clone the repository:
    ```md
    git clone https://github.com/codefeeddev/go-formatter.git
    cd go-formatter
    ```

2. Install dependencies:
    ```md
    npm install
    ```

3. Start the development server:
    ```md
    npm run dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠 Architecture

The application consists of two main components:

- **Frontend**: Next.js application with TypeScript and Tailwind CSS
- **Backend API**: Serverless functions hosted on Vercel

### Key Technologies

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting and deployment

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```md
NEXT_PUBLIC_API_URL=your-api-url
```

## 📝 Usage

1. Visit the website
2. Paste your Go code in the editor
3. The code will be automatically formatted in real-time
4. Use the toolbar options to:
   - Change themes
   - Toggle line numbers
   - Copy formatted code
   - Download code
   - Share via URL or QR code

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

Thanks to all our contributors!

<a href="https://github.com/codefeeddev/go-formatter/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=codefeeddev/go-formatter" />
</a>

## 📞 Support

If you have any questions or need help, please:

1. Check our [Issues](https://github.com/codefeeddev/go-formatter/issues) page
2. Create a new issue if your problem isn't already listed
3. Join our community discussions
