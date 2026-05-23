import type { Messages } from './en'

const id: Messages = {
  nav: {
    site: 'Situs',
    dashboard: 'Dasbor',
    settings: 'Pengaturan',
    users: 'Pengguna',
    roles: 'Peran & Izin',
    profile: 'Profil',
    signOut: 'Keluar',
    menu: 'Menu',
  },
  preferences: {
    title: 'Preferensi',
    theme: {
      label: 'Tema',
      light: 'Terang',
      dark: 'Gelap',
      system: 'Sistem',
    },
    language: {
      label: 'Bahasa',
      en: 'Inggris',
      id: 'Indonesia',
    },
  },
  breadcrumb: {
    dashboard: 'Dasbor',
    users: 'Pengguna',
    roles: 'Peran & Izin',
    profile: 'Profil',
  },
  home: {
    title: 'Laravel Vue Shadcn Starter',
    subtitle: 'SPA berjalan. Siap dibangun.',
    signIn: 'Masuk',
    signUp: 'Daftar',
    goToAdmin: 'Buka Admin',
  },
  pages: {
    dashboard: {
      title: 'Dasbor',
      description: 'Selamat datang di panel admin Anda',
      welcome: 'Halo, {name}!',
      loggedInAs: 'Anda masuk sebagai {email}.',
    },
    users: {
      title: 'Pengguna',
      description: 'Kelola akun pengguna',
      comingSoon: 'Segera Hadir',
      comingSoonText: 'Manajemen pengguna akan tersedia pada pembaruan mendatang.',
    },
    roles: {
      title: 'Peran & Izin',
      description: 'Kelola peran dan izinnya',
      comingSoon: 'Segera Hadir',
      comingSoonText: 'Manajemen peran akan tersedia pada pembaruan mendatang.',
    },
    profile: {
      title: 'Profil',
      description: 'Informasi akun Anda',
      comingSoon: 'Segera Hadir',
      comingSoonText: 'Pengeditan profil akan tersedia pada pembaruan mendatang.',
    },
  },
}

export default id
