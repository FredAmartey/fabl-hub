import Mux from '@mux/mux-node'
import { PrismaClient } from '@fabl/db'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '../../.env' })

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
})

const prisma = new PrismaClient()

async function cleanupMuxAssets() {
  try {
    console.log('🧹 Starting Mux asset cleanup...')
    
    // Get all assets from Mux
    const assets = await mux.video.assets.list({ limit: 100 })
    console.log(`Found ${assets.length} assets in Mux`)
    
    // Get all videos from database
    const dbVideos = await prisma.video.findMany({
      select: { muxAssetId: true }
    })
    const dbAssetIds = new Set(dbVideos.map(v => v.muxAssetId).filter(Boolean))
    
    // Find orphaned assets (in Mux but not in DB)
    const orphanedAssets = assets.filter(asset => !dbAssetIds.has(asset.id))
    console.log(`Found ${orphanedAssets.length} orphaned assets`)
    
    // Option 1: Delete all orphaned assets
    console.log('\nOrphaned assets to delete:')
    for (const asset of orphanedAssets) {
      console.log(`- ${asset.id}: Created ${asset.created_at}`)
    }
    
    // Option 2: Delete oldest assets
    const sortedAssets = [...assets].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    
    console.log('\nOldest 5 assets:')
    sortedAssets.slice(0, 5).forEach(asset => {
      console.log(`- ${asset.id}: Created ${asset.created_at}`)
    })
    
    // Uncomment to actually delete assets
    // WARNING: This will permanently delete assets from Mux
    /*
    console.log('\nDeleting orphaned assets...')
    for (const asset of orphanedAssets) {
      try {
        await mux.video.assets.delete(asset.id)
        console.log(`✅ Deleted asset ${asset.id}`)
      } catch (error) {
        console.error(`❌ Failed to delete asset ${asset.id}:`, error)
      }
    }
    */
    
    console.log('\n⚠️  To actually delete assets, uncomment the deletion code in the script')
    console.log('Run with: npx tsx scripts/cleanup-mux-assets.ts')
    
  } catch (error) {
    console.error('Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupMuxAssets()