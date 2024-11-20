import PDFEncryptor from '../components/PDFEncryptor'
import PDFDecryptor from '../components/PDFDecryptor'

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">PDF Encryption/Decryption</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <PDFEncryptor />
        <PDFDecryptor />
      </div>
    </div>
  )
}