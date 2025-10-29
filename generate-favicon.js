import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateFavicons() {
  const inputPath = join(__dirname, 'public', 'Novara-logo.jpeg')
  const logoPath = join(__dirname, 'public', 'logo-navbar.png')

  try {
    // First, create the navbar logo with white background and rounded corners (128x128)
    await sharp(inputPath)
      .resize(128, 128, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .composite([
        {
          input: Buffer.from(
            `<svg width="128" height="128">
            <rect width="128" height="128" rx="16" ry="16" fill="white"/>
          </svg>`
          ),
          blend: 'dest-in',
        },
      ])
      .toFile(logoPath)

    // Generate favicon.ico (32x32) with white background and rounded corners
    await sharp(inputPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .composite([
        {
          input: Buffer.from(
            `<svg width="32" height="32">
            <rect width="32" height="32" rx="4" ry="4" fill="white"/>
          </svg>`
          ),
          blend: 'dest-in',
        },
      ])
      .toFile(join(__dirname, 'public', 'favicon-32.png'))

    // Generate apple-touch-icon.png (180x180) with white background and rounded corners
    await sharp(inputPath)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .composite([
        {
          input: Buffer.from(
            `<svg width="180" height="180">
            <rect width="180" height="180" rx="24" ry="24" fill="white"/>
          </svg>`
          ),
          blend: 'dest-in',
        },
      ])
      .toFile(join(__dirname, 'public', 'apple-touch-icon.png'))

    // Generate favicon-16x16.png with white background and rounded corners
    await sharp(inputPath)
      .resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .composite([
        {
          input: Buffer.from(
            `<svg width="16" height="16">
            <rect width="16" height="16" rx="2" ry="2" fill="white"/>
          </svg>`
          ),
          blend: 'dest-in',
        },
      ])
      .toFile(join(__dirname, 'public', 'favicon-16.png'))

    // Generate main favicon.png (512x512 for PWA) with white background and rounded corners
    await sharp(inputPath)
      .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .composite([
        {
          input: Buffer.from(
            `<svg width="512" height="512">
            <rect width="512" height="512" rx="64" ry="64" fill="white"/>
          </svg>`
          ),
          blend: 'dest-in',
        },
      ])
      .toFile(join(__dirname, 'public', 'favicon.png'))

    console.log('✅ Favicons and logo generated successfully!')
    console.log('   - logo-navbar.png (128x128) - For navbar')
    console.log('   - favicon-32.png (32x32)')
    console.log('   - favicon-16.png (16x16)')
    console.log('   - favicon.png (512x512)')
    console.log('   - apple-touch-icon.png (180x180)')
    console.log('   All with white background and rounded corners!')
  } catch (error) {
    console.error('❌ Error generating favicons:', error)
  }
}

generateFavicons()
