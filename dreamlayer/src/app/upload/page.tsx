'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { showToast } from '@/utils/toast';
import Providers from '../providers';
import { uploadToIPFS } from '@/services/ipfsService';

export default function UploadPage() {
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');

  // Handle file selection and preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create a preview URL for image files
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await uploadToIPFS(file);
      
      setIpfsUrl(result.url);
      setSuccess('File successfully uploaded to IPFS!');
      showToast.success('Upload Successful', 'Your file was uploaded to IPFS');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      showToast.error('Upload Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Providers>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        
        <main className="pt-20 relative z-10">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-5xl font-bold mb-8 text-white text-center">Upload Asset to IPFS</h1>
            
            <div className="max-w-2xl mx-auto bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">File</label>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl cursor-pointer bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-1 text-sm text-white/80">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-white/60">SVG, PNG, JPG, GIF, MP4, PDF (MAX. 10MB)</p>
                      </div>
                      <input 
                        id="dropzone-file" 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                  </div>
                  
                  {previewUrl && (
                    <div className="mt-4 relative">
                      <div className="relative w-full h-48 overflow-hidden rounded-xl">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-2 text-sm text-white/80">
                        Selected file: {file?.name}
                      </div>
                    </div>
                  )}
                  
                  {file && !previewUrl && (
                    <div className="mt-4 p-4 border border-white/10 rounded-xl bg-white/[0.05]">
                      <p className="text-sm text-white/80">
                        Selected file: {file.name}
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm flex flex-col gap-2">
                    <p>{success}</p>
                    {ipfsUrl && (
                      <div>
                        <p className="font-semibold mt-2">IPFS URL:</p>
                        <a 
                          href={ipfsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-300 underline break-all"
                        >
                          {ipfsUrl}
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isLoading || !file}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90 text-white py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  ) : 'Upload to IPFS'}
                </button>
                
                <div className="pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => router.push('/vision')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-all"
                  >
                    Back to Vision
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </Providers>
  );
}
