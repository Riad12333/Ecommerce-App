const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()
// CORS plus tolérant en dev: supporte plusieurs origines via FRONTEND_URL (séparées par des virgules)
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true) // requêtes internes/outils
        if (allowedOrigins.includes(origin)) return callback(null, true)
        // Autoriser tout en DEV si FRONTEND_URL n'est pas configuré correctement
        if (process.env.NODE_ENV !== 'production') return callback(null, true)
        return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    optionsSuccessStatus: 200
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())

app.use("/api",router)

// Endpoint de santé pour débogage rapide
app.get('/api/health', (req, res) => {
    res.json({ ok: true, env: process.env.NODE_ENV || 'development' })
})

// Route de test pour vérifier que le serveur répond
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend Server is running!',
        endpoints: {
            health: '/api/health',
            dashboard: '/api/dashboard-stats',
            allCarts: '/api/all-carts',
            allUsers: '/api/all-user'
        }
    })
})

const PORT = process.env.PORT || 8080


connectDB()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log("[Server] Running on port "+PORT)
        })
    })
    .catch((err)=>{
        console.error("[Server] Arrêt: la connexion DB a échoué.")
        process.exit(1)
    })
