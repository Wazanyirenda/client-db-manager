# Client Database Manager

A modern, full-featured client management dashboard built with Next.js 16, Supabase, and TypeScript.

## Features

- 🔐 **Authentication** - Secure user authentication with Supabase Auth
- 📊 **Dashboard** - Real-time statistics and metrics
- 👥 **Client Management** - Full CRUD operations (Create, Read, Update, Delete)
- 🔍 **Search & Filter** - Search clients by name, email, phone, or company
- 📈 **Sorting** - Sort by any column (name, email, company, status, date)
- 📄 **Pagination** - Navigate through large client lists easily
- 📤 **Export** - Export client data to CSV, Excel, or PDF
- 🎨 **Modern UI** - Beautiful, responsive design with dark mode support
- ✅ **Status Management** - Track active/inactive client status

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Type Safety**: TypeScript
- **Export Libraries**: xlsx, jsPDF

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Wazanyirenda/client-db-manager.git
cd client-db-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from your Supabase project settings: [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api)

4. Set up the database:
Run the migrations in your Supabase SQL Editor:
- `supabase/migrations/001_create_clients.sql`
- `supabase/migrations/002_add_company_status.sql`

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Creating Your First User

1. Navigate to `/signup` or click "Sign up" on the login page
2. Create an account with your email and password
3. Sign in and start managing your clients!

## Project Structure

```
client-db-manager/
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── page.tsx         # Main dashboard
│   └── layout.tsx       # Root layout
├── components/
│   ├── auth/            # Authentication components
│   ├── clients/          # Client management components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── hooks/            # Custom React hooks
│   ├── supabase/         # Supabase client configuration
│   └── export.ts         # Export utilities
└── supabase/
    └── migrations/       # Database migrations
```

## Features in Detail

### Client Management
- Add new clients with name, email, phone, address, company, and status
- Edit existing client information
- Delete clients with confirmation dialog
- Toggle client status (Active/Inactive) with one click

### Search & Filter
- Real-time search across all client fields
- Filter by status (All, Active, Inactive)
- Sort by any column in ascending or descending order

### Export Options
- **CSV**: Export to comma-separated values
- **Excel**: Export to .xlsx format
- **PDF**: Generate formatted PDF reports

### Dashboard Statistics
- Total clients count
- Active clients count
- Inactive clients count
- Clients added this month

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
