import { test as setup } from '@playwright/test'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '../..')

setup('prepare database and build assets', async () => {
  console.log('🗄️  Running migrate:fresh --seed...')
  execSync('php artisan migrate:fresh --seed --no-interaction', {
    cwd: projectRoot,
    stdio: 'inherit',
  })

  console.log('🏗️  Building frontend assets...')
  execSync('npm run build', {
    cwd: projectRoot,
    stdio: 'inherit',
  })

  console.log('✅ Global setup complete.')
})
