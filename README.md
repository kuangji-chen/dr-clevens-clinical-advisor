# Dr. Clevens Cosmetic Procedure Advisor Chatbot

A sophisticated AI-powered chatbot for Dr. Clevens' cosmetic surgery practice, featuring intelligent conversation flow, semantic gallery system, and real-time Claude AI integration.

## 🌟 Features

### 🤖 Intelligent Conversation System
- **8-State Conversation Flow**: Welcome → Classify → Education → Gallery → Qualify → Booking → Capture → Complete
- **Procedure Detection**: Automatically identifies user interests (rhinoplasty, facial rejuvenation, mommy makeover, breast surgery)
- **Lead Capture**: Intelligent extraction of contact information
- **Dynamic Quick Picks**: Context-aware response suggestions

### 🖼️ Semantic Gallery System
- **Natural Language Understanding**: Claude AI automatically triggers relevant image galleries
- **Multiple Gallery Types**: Before/after results, procedure steps, facility tours, doctor credentials, technique comparisons
- **Smart Image Display**: Responsive layouts with automatic fallbacks
- **Context-Aware Filtering**: Shows procedure-specific and demographic-filtered content

### 🎨 Professional Medical UI
- **Modern Design**: Clean, medical-grade interface with Dr. Clevens branding
- **Real-time Chat**: Streaming responses with typing indicators
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: WCAG compliant with proper contrast and navigation

### 🔧 Technical Excellence
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS v4**: Modern utility-first styling
- **Zustand**: Lightweight state management
- **Claude 3.5 Sonnet**: Advanced AI with citations and structured responses

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Claude API key from Anthropic

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatbot-advisor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Add your Claude API key:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
chatbot-advisor/
├── app/
│   ├── api/
│   │   ├── chat/route.ts           # Claude AI integration with streaming
│   │   └── placeholder/[...]/route.ts # Dynamic placeholder images
│   ├── globals.css                 # Global styles and Tailwind imports
│   ├── layout.tsx                  # Root layout with metadata
│   └── page.tsx                    # Main chat interface page
├── components/
│   ├── ConversationalAdvisor.tsx   # Main chat component
│   ├── MessageComponent.tsx        # Message rendering with gallery support
│   └── CallModal.tsx              # Voice consultation modal
├── data/
│   └── galleryImages.ts           # Gallery data and helper functions
├── store/
│   └── conversationStore.ts       # Zustand state management
├── types/
│   └── conversation.ts            # TypeScript interfaces
├── utils/
│   ├── claudeService.ts           # Claude API service layer
│   └── sessionStorage.ts          # Session persistence utilities
├── GALLERY_SYSTEM.md              # Detailed gallery documentation
├── TECHNICAL_SPEC.md              # Complete technical specification
└── next.config.ts                 # Next.js configuration
```

## 🎯 Usage Examples

### Natural Gallery Triggers
```
User: "Show me before and after photos"
→ Displays before/after results gallery

User: "Can I see your facility?"
→ Shows facility tour gallery

User: "What are Dr. Clevens' credentials?"
→ Displays doctor credentials gallery

User: "How does rhinoplasty work?"
→ Shows procedure steps gallery
```

### Conversation Flow
```
1. Welcome: "Hi there! I'm here to help you explore your options with Dr. Clevens."
2. Classify: User expresses interest in specific procedure
3. Education: Detailed information about the procedure
4. Gallery: Visual examples and facility tour
5. Qualify: Medical history and candidacy assessment
6. Booking: Consultation scheduling
7. Capture: Contact information collection
8. Complete: Summary and next steps
```

## 🛠️ Development

### Key Technologies
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS v4
- **State Management**: Zustand with session persistence
- **AI Integration**: Claude 3.5 Sonnet via Anthropic SDK
- **Styling**: Modern medical UI with responsive design
- **Icons**: Lucide React icon library

### Environment Setup
```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables
```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-your-claude-key

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 📈 Features in Detail

### Semantic Gallery System
The chatbot intelligently displays relevant images based on conversation context:

- **Before/After Results**: Patient results filtered by procedure type
- **Procedure Steps**: Educational content showing surgical process  
- **Facility Tour**: Office spaces and medical equipment
- **Doctor Credentials**: Professional qualifications and awards
- **Technique Comparison**: Advanced surgical methods

See [GALLERY_SYSTEM.md](./GALLERY_SYSTEM.md) for complete documentation.

### Conversation State Management
Smart flow control with:
- Procedure type detection and classification
- Context-aware response generation
- Dynamic quick pick suggestions
- Lead information extraction
- Session persistence

### Medical Compliance
- Professional medical disclaimers
- Emphasis on consultation requirements
- No specific medical diagnoses
- Privacy-compliant data handling

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Environment Variables for Production
- `ANTHROPIC_API_KEY`: Your Claude API key
- `NEXT_PUBLIC_APP_URL`: Your domain URL

## 📚 Documentation

- [Gallery System](./GALLERY_SYSTEM.md) - Comprehensive gallery documentation
- [Technical Specification](./TECHNICAL_SPEC.md) - Complete technical details
- [API Routes](./app/api/) - Backend API implementation
- [Components](./components/) - React component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Maintain test coverage
- Update documentation for new features

## 🔒 Security & Privacy

- **No data persistence**: Conversations are session-only
- **HIPAA considerations**: No medical records stored
- **API security**: Server-side Claude API calls only
- **Input validation**: Sanitized user inputs

## 📄 License

This project is proprietary software for Dr. Clevens' medical practice.

## 🆘 Support

For technical support or questions:
- Review the [Technical Specification](./TECHNICAL_SPEC.md)
- Check the [Gallery System Documentation](./GALLERY_SYSTEM.md)
- Open an issue in the repository

## 🚀 Next.js Information

This project is built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Learn More About Next.js
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js) - feedback and contributions welcome

---

**Built with ❤️ for Dr. Clevens Face and Body Specialists**