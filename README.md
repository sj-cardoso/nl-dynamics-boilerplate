# 🚀 novalogica | Dynamics 365 React Boilerplate

<div align="center">

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Production-ready React boilerplate for Microsoft Dynamics 365 development**

_Build modern, type-safe applications that seamlessly integrate with Dataverse_

[🎯 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🔧 Features](#-features) • [💡 Examples](#-examples)

</div>

---

## 🎯 Quick Start

Get up and running in **under 5 minutes**:

### Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** ([Download here](https://nodejs.org/))
- ✅ **Dynamics 365 environment** with system admin access
- ✅ **Azure App Registration** ([Setup guide](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/walkthrough-register-app-azure-active-directory))

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/novalogica/nl-dynamics-boilerplate.git
cd nl-dynamics-boilerplate

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy the environment template
cp .env.example .env
```

Edit your `.env` file with your Dynamics 365 details:

```env
# Your D365 Organization URL (find in Power Platform Admin Center)
REACT_APP_D365_API_URL=https://your-org.crm4.dynamics.com

# Your Azure App Registration Client ID (from Azure Portal)
CLIENT_ID=your-azure-app-client-id

# OAuth URL (replace with your D365 URL)
AUTH_URL=https://login.microsoftonline.com/common/oauth2/authorize?resource=https://your-org.crm4.dynamics.com
```

### 3. Start Development

```bash
npm start
```

**That's it!** 🎉

The app will:

1. 🔐 Automatically handle OAuth authentication
2. 🔗 Connect to your Dataverse environment
3. 🚀 Launch at `http://localhost:3000`

---

## 🔧 Features

### 🎨 **Modern Tech Stack**

- **React 19** with latest features and performance optimizations
- **TypeScript** for complete type safety and better DX
- **Tailwind CSS** for rapid, responsive UI development
- **shadcn/ui** for beautiful, accessible components

### 🔗 **Dataverse Integration**

- **Complete CRUD operations** with type-safe APIs
- **Automatic OAuth authentication** with token refresh
- **Custom hooks pattern** for clean, reusable business logic
- **Error handling & loading states** built-in

### 🏗️ **Developer Experience**

- **Zero-config setup** - works out of the box
- **Built-in documentation** with interactive examples
- **D365 Web Resource ready** - optimized build output

---

## 📖 Documentation

### 🏃‍♂️ **Built-in Interactive Docs**

This boilerplate includes comprehensive documentation accessible right in the app:

```bash
npm start
# Click "View Docs" in the interface
```

**Documentation covers:**

- 📋 Step-by-step setup guide
- 🏗️ Project architecture overview
- 🔧 Creating custom entity hooks
- 🎨 Working with components
- 🚀 Deployment strategies

### 📁 **Project Structure**

```
src/
├── 📁 components/ui/        # shadcn/ui components
├── 📁 pages/               # Application pages
│   ├── home.tsx           # Landing page
│   ├── documentation.tsx  # Built-in docs
│   └── demo.tsx          # CRUD demo
├── 📁 providers/          # React context providers
├── 📁 hooks/              # Custom React hooks
│   ├── useDataverse.ts   # Dataverse connection
│   └── useAccounts.ts    # Account CRUD operations
├── 📁 contexts/           # React contexts
└── 📁 lib/               # Utility functions
```

---

## 💡 Examples

### 🔍 Basic Dataverse Operations

```typescript
import { useAccounts } from "@/hooks/useAccounts";

const AccountsComponent = () => {
  const { accounts, loading, fetchAccounts, createAccount } = useAccounts();

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Create new account
  const handleCreate = async () => {
    await createAccount({
      name: "New Account",
      emailaddress1: "test@example.com",
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create Account</button>
      {accounts.map((account) => (
        <div key={account.accountid}>{account.name}</div>
      ))}
    </div>
  );
};
```

### 🎣 Creating Custom Entity Hooks

```typescript
// hooks/useContacts.ts
export const useContacts = () => {
  const { api, isReady } = useDataverse();
  const [contacts, setContacts] = useState<Contact[]>([]);

  const fetchContacts = useCallback(async () => {
    const response = await api.retrieveMultiple({
      collection: "contacts",
      select: ["contactid", "fullname", "emailaddress1"],
      filter: "statecode eq 0",
    });
    setContacts(response?.value || []);
  }, [api, isReady]);

  return { contacts, fetchContacts };
};
```

### 🎨 Adding New Pages

```typescript
// 1. Add page type
export type PageKey = "home" | "docs" | "demo" | "contacts";

// 2. Configure in pages-config.ts
export const PAGES = {
  contacts: {
    title: "Contacts",
    description: "Manage contact records",
    component: ContactsPage,
  },
};

// 3. Navigate programmatically
const { navigateTo } = useNavigation();
navigateTo("contacts");
```

---

## 🚀 Deployment

### 🌐 D365 Web Resources\*\*

```bash
# Build for production
npm run build

# Upload files to D365:
# 📄 build/index.html → HTML Web Resource
# 📜 build/static/js/bundle.js → JavaScript Web Resource
# 🎨 build/static/css/bundle.css → CSS Web Resource
```

---

## 🛠️ Available Scripts

| Command            | Description                            |
| ------------------ | -------------------------------------- |
| `npm start`        | 🚀 Start development server with OAuth |
| `npm run build`    | 📦 Build optimized production bundle   |
| `node getToken.js` | 🔑 Manual token refresh                |

---

## 🎨 Built With

This boilerplate leverages the best modern web technologies:

| Technology                                                           | Purpose       | Version |
| -------------------------------------------------------------------- | ------------- | ------- |
| [React](https://reactjs.org/)                                        | UI Framework  | 19.1.0  |
| [TypeScript](https://www.typescriptlang.org/)                        | Type Safety   | 4.9.5   |
| [Tailwind CSS](https://tailwindcss.com/)                             | Styling       | 4.1.11  |
| [shadcn/ui](https://ui.shadcn.com/)                                  | Components    | Latest  |
| [dynamics-web-api](https://github.com/AleksandrRogov/DynamicsWebApi) | Dataverse API | 2.3.1   |

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔄 Open a Pull Request

---

## 🆘 Support & Resources

### 📚 **Documentation**

- 📖 [Built-in Documentation](http://localhost:3000) - Available in the app
- 🔗 [DynamicsWebApi Docs](https://github.com/AleksandrRogov/DynamicsWebApi)
- 🎨 [shadcn/ui Components](https://ui.shadcn.com/docs/components)

### 🐛 **Issues & Support**

- 🚨 [Report Issues](https://github.com/novalogica/nl-dynamics-boilerplate/issues)
- 💬 [Discussions](https://github.com/novalogica/nl-dynamics-boilerplate/discussions)
- 📧 Email: support@novalogica.pt

### 🔗 **Useful Links**

- [Dataverse Web API Reference](https://docs.microsoft.com/en-us/power-apps/developer/data-platform/webapi/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⭐ Star this repository](https://github.com/novalogica/nl-dynamics-boilerplate)** if you find it useful!

Made with ❤️ by [novalogica](https://github.com/novalogica)

_Empowering developers to build amazing Dynamics 365 applications_

</div>
