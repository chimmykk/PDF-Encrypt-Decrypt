"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'

// Define the response type
interface EncryptResponse {
  encryptedFile: string
}

const PDFEncryptor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [secretKey, setSecretKey] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('Please select a PDF file')
    }
  }

  const handleEncrypt = async () => {
    if (!file || !secretKey) {
      alert('Please select a PDF and enter a secret key')
      return
    }

    try {
      const base64File = await convertToBase64(file)
      
      // Type-safe axios call
      const response = await axios.post<EncryptResponse>('/api/encrypt', {
        file: base64File,
        secretKey
      })

      const blob = new Blob([response.data.encryptedFile], { type: 'text/plain' })
      saveAs(blob, `${file.name}.encrypted`)
    } catch (error) {
      console.error('Encryption error:', error)
      alert('Encryption failed')
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">PDF Encryptor</h2>
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileChange} 
        className="mb-4"
      />
    <input
  type="password"
  placeholder="Enter Secret Key"
  value={secretKey}
  onChange={(e) => setSecretKey(e.target.value)}
  className="w-full p-2 border rounded mb-4 text-black"
/>

      <button 
        onClick={handleEncrypt} 
        disabled={!file || !secretKey}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Encrypt PDF
      </button>
    </div>
  )
}

export default PDFEncryptor