import dotenv from 'dotenv'
dotenv.config()

/**
 * Configuração do Active Directory
 */
const config = {
    url:process.env.AD_URL,
    baseDN:process.env.AD_BASEDN,
    username:process.env.AD_USERNAME,
    password:process.env.AD_PASSWORD
}

export default config