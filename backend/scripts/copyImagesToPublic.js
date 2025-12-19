const fs = require('fs')
const path = require('path')

// Script pour copier les images de src/assest/products vers public/assest/products
function copyImagesToPublic() {
    try {
        const sourcePath = path.join(__dirname, '../../frontend/src/assest/products')
        const destPath = path.join(__dirname, '../../frontend/public/assest/products')
        
        console.log('[COPY] Copie des images vers public/...')
        console.log(`[COPY] Source: ${sourcePath}`)
        console.log(`[COPY] Destination: ${destPath}`)
        
        if (!fs.existsSync(sourcePath)) {
            console.error(`[COPY] Le dossier source ${sourcePath} n'existe pas`)
            process.exit(1)
        }
        
        // Créer le dossier de destination s'il n'existe pas
        if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true })
            console.log(`[COPY] Dossier créé: ${destPath}`)
        }
        
        // Fonction récursive pour copier un dossier
        function copyDir(src, dest) {
            const entries = fs.readdirSync(src, { withFileTypes: true })
            
            entries.forEach(entry => {
                const srcPath = path.join(src, entry.name)
                const destPath = path.join(dest, entry.name)
                
                if (entry.isDirectory()) {
                    if (!fs.existsSync(destPath)) {
                        fs.mkdirSync(destPath, { recursive: true })
                    }
                    copyDir(srcPath, destPath)
                } else if (entry.isFile() && /\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
                    // Copier uniquement les fichiers image
                    fs.copyFileSync(srcPath, destPath)
                }
            })
        }
        
        // Copier tous les fichiers
        copyDir(sourcePath, destPath)
        
        console.log('[COPY] ✅ Images copiées avec succès!')
        console.log('[COPY] Les images sont maintenant accessibles via /assest/products/...')
        
    } catch (error) {
        console.error('[COPY] ❌ Erreur lors de la copie:', error.message)
        console.error(error.stack)
        process.exit(1)
    }
}

copyImagesToPublic()

