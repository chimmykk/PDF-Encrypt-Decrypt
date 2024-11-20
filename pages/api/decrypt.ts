import { NextApiRequest, NextApiResponse } from 'next'
import CryptoJS from 'crypto-js'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { encryptedFile, secretKey } = req.body

    if (!encryptedFile || !secretKey) {
      return res.status(400).json({ message: 'Encrypted file and secret key are required' })
    }

    const decryptedData = CryptoJS.AES.decrypt(
      encryptedFile, 
      secretKey
    ).toString(CryptoJS.enc.Utf8)

    if (!decryptedData) {
      return res.status(400).json({ message: 'Decryption failed' })
    }

    res.status(200).json({ 
      decryptedFile: decryptedData 
    })
  } catch (error) {
    console.error('Decryption error:', error)
    res.status(500).json({ 
      message: 'Decryption failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}
