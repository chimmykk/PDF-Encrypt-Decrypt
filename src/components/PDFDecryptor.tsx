

"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'
import { PDFDocument } from 'pdf-lib'


interface DecryptResponse {
  decryptedFile: string
}

const PDFDecryptor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [secretKey, setSecretKey] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleDecrypt = async () => {
    if (!file || !secretKey) {
      alert('Please select an encrypted file and enter the secret key')
      return
    }

    try {
      const encryptedText = await file.text()
      
      // Type-safe axios call
      const response = await axios.post<DecryptResponse>('/api/decrypt', {
        encryptedFile: encryptedText,
        secretKey
      })

      const decryptedBase64 = response.data.decryptedFile
      const base64Response = decryptedBase64.split(',')[1]
      const decryptedBytes = atob(base64Response)
      const uint8Array = new Uint8Array(decryptedBytes.split('').map(char => char.charCodeAt(0)))
      
      const pdfDoc = await PDFDocument.load(uint8Array)
      const pdfBytes = await pdfDoc.save()
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      saveAs(blob, file.name.replace('.encrypted', ''))
    } catch (error) {
      console.error('Decryption error:', error)
      alert('Decryption failed. Check your secret key.')
    }
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">PDF Decryptor</h2>
      <input 
        type="file" 
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
        onClick={handleDecrypt} 
        disabled={!file || !secretKey}
        className="bg-green-500 text-white p-2 rounded"
      >
        Decrypt PDF
      </button>
    </div>
  )
}

export default PDFDecryptor