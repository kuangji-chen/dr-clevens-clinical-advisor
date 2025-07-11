# Dr. Clevens Clinical Advisor

An intelligent AI-powered clinical advisor chatbot for Dr. Clevens' cosmetic surgery practice, providing personalized consultation guidance, procedure education, and seamless patient journey management.

## 🌟 Features

### 🤖 Intelligent Clinical Consultation System
- **8-State Patient Journey**: Welcome → Classify → Education → Gallery → Qualify → Booking → Capture → Complete
- **Procedure Assessment**: Automatically identifies patient interests and provides relevant information
- **Lead Qualification**: Intelligent extraction and management of patient information
- **Dynamic Consultation Flow**: Context-aware response suggestions and guidance

### 🖼️ Semantic Visual Content System
- **Intelligent Image Display**: Claude AI automatically shows relevant clinical content
- **Multiple Content Types**: Before/after results, procedure education, facility tours, doctor credentials, technique comparisons
- **Smart Content Delivery**: Responsive layouts with automatic fallbacks
- **Context-Aware Filtering**: Shows procedure-specific and patient-demographic-filtered content

### 🎨 Professional Medical Interface
- **Clinical-Grade Design**: Clean, professional interface with Dr. Clevens branding
- **Real-time Consultation**: Streaming AI responses with typing indicators
- **Mobile Responsive**: Optimized for all device sizes and consultation environments
- **Accessibility Compliant**: WCAG standards for inclusive patient access

### 🔧 Advanced Technical Foundation
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety and clinical data integrity
- **Tailwind CSS v4**: Modern utility-first styling
- **Zustand**: Lightweight patient journey state management
- **Claude 3.5 Sonnet**: Advanced AI with medical citations and structured responses

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
│   │   ├── chat/route.ts           # Claude AI clinical consultation integration
│   │   └── placeholder/[...]/route.ts # Dynamic clinical content placeholders
│   ├── globals.css                 # Global medical UI styles
│   ├── layout.tsx                  # Root layout with clinical metadata
│   └── page.tsx                    # Main clinical advisor interface
├── components/
│   ├── ConversationalAdvisor.tsx   # Main clinical consultation component
│   ├── MessageComponent.tsx        # Clinical message rendering with visual content
│   └── CallModal.tsx              # Voice consultation scheduling modal
├── data/
│   └── galleryImages.ts           # Clinical visual content and educational materials
├── store/
│   └── conversationStore.ts       # Patient journey state management
├── types/
│   └── conversation.ts            # Clinical consultation TypeScript interfaces
├── utils/
│   ├── claudeService.ts           # Claude AI clinical service layer
│   └── sessionStorage.ts          # Patient session persistence utilities
├── GALLERY_SYSTEM.md              # Visual content system documentation
├── TECHNICAL_SPEC.md              # Complete technical specification
└── next.config.ts                 # Next.js configuration for clinical app
```

## 🎯 Clinical Usage Examples

### Natural Patient Interactions
```
Patient: "I'm interested in rhinoplasty"
→ Provides detailed procedure information and assessment

Patient: "Show me before and after photos"
→ Displays relevant patient results and educational content

Patient: "Can I see your facility?"
→ Shows facility tour and clinical environment

Patient: "What are Dr. Clevens' credentials?"
→ Displays doctor qualifications and professional background

Patient: "How does the consultation process work?"
→ Explains consultation flow and scheduling options
```

### Patient Journey Flow
```
1. Welcome: Initial greeting and needs assessment
2. Classify: Procedure interest identification and education
3. Education: Detailed clinical information and patient education
4. Gallery: Visual examples and facility introduction
5. Qualify: Medical history and candidacy assessment
6. Booking: Consultation scheduling and preparation
7. Capture: Patient contact information and preferences
8. Complete: Journey summary and next steps coordination
```

## 🛠️ Development

### Key Technologies
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS v4
- **Clinical State Management**: Zustand with patient session persistence
- **AI Integration**: Claude 3.5 Sonnet via Anthropic SDK for clinical responses
- **Medical UI Styling**: Professional medical interface with responsive design
- **Clinical Icons**: Lucide React medical and interface icons

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

## 📈 Clinical Features in Detail

### Intelligent Visual Content System
The clinical advisor intelligently displays relevant content based on patient consultation context:

- **Patient Results**: Before/after outcomes filtered by procedure type
- **Procedure Education**: Educational content showing surgical process and techniques
- **Facility Introduction**: Office spaces, surgical suites, and medical equipment
- **Doctor Credentials**: Professional qualifications, certifications, and recognition
- **Technique Education**: Advanced surgical methods and approach comparisons

See [GALLERY_SYSTEM.md](./GALLERY_SYSTEM.md) for complete visual content documentation.

### Patient Journey Management
Smart consultation flow control with:
- Procedure interest detection and classification
- Context-aware clinical response generation
- Dynamic consultation guidance suggestions
- Patient information collection and management
- Session-based consultation persistence

### Medical Compliance & Standards
- Professional medical disclaimers and legal compliance
- Emphasis on in-person consultation requirements
- No diagnostic capabilities or medical advice
- HIPAA-compliant data handling practices
- Privacy-focused patient interaction design

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
- `ANTHROPIC_API_KEY`: Your Claude API key for clinical AI responses
- `NEXT_PUBLIC_APP_URL`: Your clinical advisor domain URL

## 📚 Documentation

- [Visual Content System](./GALLERY_SYSTEM.md) - Clinical visual content documentation
- [Technical Specification](./TECHNICAL_SPEC.md) - Complete technical details
- [API Routes](./app/api/) - Backend clinical consultation implementation
- [Components](./components/) - React clinical component documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/clinical-enhancement`
3. Commit your changes: `git commit -m 'Add clinical feature'`
4. Push to the branch: `git push origin feature/clinical-enhancement`
5. Open a Pull Request

### Development Guidelines
- Follow medical software best practices
- Use semantic commit messages
- Maintain clinical compliance standards
- Update documentation for new clinical features

## 🔒 Security & Privacy

- **No persistent patient data**: Consultations are session-only
- **HIPAA considerations**: No medical records or PHI stored
- **API security**: Server-side Claude AI calls only
- **Input validation**: Sanitized patient inputs and clinical data protection

## 📄 License

This project is proprietary software for Dr. Clevens Face and Body Specialists medical practice.

## 🆘 Support

For technical support or clinical advisor questions:
- Review the [Technical Specification](./TECHNICAL_SPEC.md)
- Check the [Visual Content System Documentation](./GALLERY_SYSTEM.md)
- Open an issue in the repository

## 🚀 Next.js Information

This clinical advisor is built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### Learn More About Next.js
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js) - feedback and contributions welcome

---

**Clinical Advisor built with ❤️ for Dr. Clevens Face and Body Specialists**