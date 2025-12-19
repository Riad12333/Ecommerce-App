const imageTobase64 = async(image, maxWidth = 800, quality = 0.7) =>{
    // Vérifier que l'image est un fichier valide
    if (!image || !(image instanceof Blob)) {
        throw new Error('Le fichier image est invalide')
    }
    
    // Vérifier la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB en bytes
    if (image.size > maxSize) {
        throw new Error('La taille de l\'image est trop grande. Maximum 5MB autorisé.')
    }
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                // Créer un canvas pour redimensionner l'image
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height
                
                // Redimensionner si nécessaire
                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }
                
                canvas.width = width
                canvas.height = height
                
                // Dessiner l'image redimensionnée
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                
                // Convertir en base64 avec compression
                const compressedData = canvas.toDataURL('image/jpeg', quality)
                resolve(compressedData)
            }
            
            img.onerror = () => {
                reject(new Error('Impossible de charger l\'image'))
            }
            
            img.src = e.target.result
        }
        
        reader.onerror = (error) => {
            reject(error)
        }
        
        reader.readAsDataURL(image)
    })
}

export default imageTobase64
