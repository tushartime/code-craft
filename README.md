# Code Craft

A modern web application built with Next.js that empowers developers to craft exceptional digital experiences.

## 🚀 Features

- **Modern Stack**: Built with Next.js 14+ for optimal performance and developer experience
- **Type Safety**: Full TypeScript support for robust development
- **Optimized Fonts**: Geist font family integration for enhanced readability
- **Fast Refresh**: Hot reloading for instant development feedback
- **Production Ready**: Optimized for deployment on Vercel and other platforms

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: CSS Modules / Tailwind CSS (update as needed)
- **Fonts**: [Geist](https://vercel.com/font) by Vercel
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.0 or later
- npm, yarn, pnpm, or bun package manager

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/tushartime/code-craft.git
   cd code-craft
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📁 Project Structure

```
code-craft/
├── app/                    # App Router directory (Next.js 13+)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page component
├── public/                 # Static assets
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configurations
├── types/                  # TypeScript type definitions
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration (if applicable)
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## 🎨 Customization

### Editing Pages
Start by modifying `app/page.tsx` to customize the home page. The page will automatically update as you edit the file thanks to Fast Refresh.

### Adding Components
Create reusable components in the `components/` directory and import them into your pages.

### Styling
This project uses optimized font loading with the Geist font family. You can customize the styling approach based on your preferences:
- CSS Modules for component-scoped styles
- Tailwind CSS for utility-first styling
- Styled Components for CSS-in-JS

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Source code and community

## 🚀 Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket)
2. Import your project to Vercel
3. Vercel will automatically detect it's a Next.js project and configure the build settings
4. Your app will be deployed and you'll get a URL to share

### Other Deployment Options

- **Netlify**: Connect your Git repository for automatic deployments
- **Railway**: Simple deployment with Git integration
- **Digital Ocean**: Use App Platform for container-based deployment
- **AWS**: Deploy using Amplify or EC2 with PM2

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tushar**
- GitHub: [@tushartime](https://github.com/tushartime)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Vercel](https://vercel.com/) for hosting and font optimization
- Open source community for continuous inspiration

---

<div align="center">
  Made with ❤️ using Next.js
</div>
