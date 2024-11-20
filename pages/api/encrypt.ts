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
    const { file, secretKey } = req.body

    if (!file || !secretKey) {
      return res.status(400).json({ message: 'File and secret key are required' })
    }

    const encryptedData = CryptoJS.AES.encrypt(file, secretKey).toString()

    res.status(200).json({ 
      encryptedFile: encryptedData 
    })
  } catch (error) {
    console.error('Encryption error:', error)
    res.status(500).json({ 
      message: 'Encryption failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
}