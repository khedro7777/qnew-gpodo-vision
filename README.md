
# GPO SMART Platform

A Progressive Web App (PWA) for collaborative business negotiations, smart procurement, and fair partnerships.

## 🌍 Platform Overview

GPO SMART is a comprehensive platform that enables:
- **Collaborative Procurement**: Group buying for better prices
- **Smart Negotiations**: AI-powered negotiation tools
- **Group Formation**: Create and manage business groups
- **Arbitration & Documentation**: Built-in dispute resolution
- **Multi-Gateway System**: 12 specialized business portals

## 🧩 Technical Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: TailwindCSS 3+
- **Build Tool**: Vite
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **PWA**: Service Workers, Offline Support

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd gpo-smart
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Run Development**
   ```bash
   npm run dev
   ```

## 📱 Features

### Core Platform
- **Multi-language Support**: EN, AR, FR, CN, ES, HI, JP, KR
- **Responsive Design**: Mobile-first PWA
- **Real-time Updates**: Live notifications and chat
- **Role-based Access**: Comprehensive permission system

### 12 Smart Gateways
1. **Cooperative Purchasing** - Group buying power
2. **Cooperative Marketing** - Joint campaigns
3. **Company Formation** - Business incorporation
4. **Investment Groups** - Collective funding
5. **Suppliers** - Vendor marketplace
6. **Freelancers** - Talent platform
7. **Freelancer Teams** - Team collaboration
8. **Service Providers** - Professional services
9. **Product Listings** - B2B marketplace
10. **Arbitration & Documentation** - Dispute resolution
11. **Arbitration Requests** - Case management
12. **Smart Negotiation Tools** - AI-assisted deals

### Smart Features
- **MCP Testing System**: Skills assessment
- **AI Agents**: 12 specialized AI assistants
- **Reputation System**: Trust & rating management
- **Voting & Governance**: Democratic decision making
- **Contract Management**: Legal document handling
- **Task Management**: Kanban-style boards

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components
│   ├── ui/             # Base UI components
│   ├── workflow/       # Business workflow components
│   └── dashboard/      # Dashboard widgets
├── pages/              # Route pages
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── types/              # TypeScript definitions
└── utils/              # Utility functions
```

### Database Schema
- **Users & Profiles**: Authentication & user data
- **Groups & Members**: Group management
- **Votes & Proposals**: Governance system
- **Tasks & Contracts**: Work management
- **Messages & Notifications**: Communication
- **Arbitration Cases**: Dispute resolution

## 🔐 Security Features

- **Row Level Security (RLS)**: Database access control
- **KYC Verification**: Identity validation
- **Multi-factor Authentication**: Enhanced security
- **Audit Logging**: Complete activity trails
- **Data Encryption**: Secure data handling

## 🌐 Internationalization

Built-in support for 8 languages with:
- RTL support for Arabic
- Currency localization
- Date/time formatting
- Cultural adaptations

## 📊 Business Logic

### User Workflow
1. **Registration** → KYC → Role Selection
2. **Gateway Selection** → Group Formation/Joining
3. **Collaboration** → Voting → Contract Execution
4. **Dispute Resolution** → Arbitration → Resolution

### Points System
- Entry points for premium groups
- Earned through platform participation
- Spent on services and group memberships
- Transparent transaction history

## 🤖 AI Integration

12 Specialized AI Agents:
- **Sami**: Demand analysis
- **Nour**: Market research
- **Lina**: Legal contracts
- **Ziad**: Arbitration supervision
- **Hani**: Negotiation coaching
- And 7 more specialized agents...

## 🚀 Deployment

### Vercel Deployment
```bash
npm run build
vercel --prod
```

### Environment Variables
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 👥 Founders

**Mohamed Hassanein & Ahmed Seddiq**
- International trade expertise
- Legal arbitration experience
- Technology & platform development
- 25+ years combined experience

## 📞 Support

- **Website**: [www.gpodo.com](https://www.gpodo.com)
- **Email**: support@gpodo.com
- **Legal**: legal@gpodo.com

## 📄 License

© 2025 GPO SMART Platform. All rights reserved.

---

*Built with ❤️ for the global business community*
