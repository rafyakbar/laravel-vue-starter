const en = {
  nav: {
    site: 'Site',
    dashboard: 'Dashboard',
    settings: 'Settings',
    users: 'Users',
    roles: 'Roles & Permissions',
    profile: 'Profile',
    signOut: 'Sign Out',
    menu: 'Menu',
  },
  preferences: {
    title: 'Preferences',
    theme: {
      label: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
    },
    language: {
      label: 'Language',
      en: 'English',
      id: 'Indonesia',
    },
  },
  breadcrumb: {
    dashboard: 'Dashboard',
    users: 'Users',
    roles: 'Roles & Permissions',
    profile: 'Profile',
  },
  home: {
    title: 'Laravel Vue Shadcn Starter',
    subtitle: 'SPA is working. Ready to build.',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    goToAdmin: 'Go to Admin',
  },
  pages: {
    dashboard: {
      title: 'Dashboard',
      description: 'Welcome to your admin panel',
      welcome: 'Hello, {name}!',
      loggedInAs: "You're logged in as {email}.",
    },
    users: {
      title: 'Users',
      description: 'Manage user accounts',
      comingSoon: 'Coming Soon',
      comingSoonText: 'User management will be available in a future update.',
    },
    roles: {
      title: 'Roles & Permissions',
      description: 'Manage roles and their permissions',
      comingSoon: 'Coming Soon',
      comingSoonText: 'Role management will be available in a future update.',
    },
    profile: {
      title: 'Profile',
      description: 'Your account information',
      comingSoon: 'Coming Soon',
      comingSoonText: 'Profile editing will be available in a future update.',
    },
  },
} as const

export default en

export type Messages = typeof en
