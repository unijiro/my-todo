// app/components/imageapp.tsx
"use client";

import React, { useState } from 'react';

const ImageApp: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!uploadedImageUrl) {
      setUploadError('No image to delete.');
      return;
    }

    try {
      const filename = uploadedImageUrl.split('/').pop(); // Extract filename from URL
      const response = await fetch(`/api/pics?filename=${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedImageUrl(null);
        setPreviewUrl(null);
        setSelectedFile(null);
      } else {
        const errorData = await response.json();
        setUploadError(errorData.error || 'Delete failed.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setUploadError('Delete failed.');
    }
  };

  const handleGet = async () => {
    if (!uploadedImageUrl) {
      setUploadError('No image to retrieve.');
      return;
    }

    try {
      const filename = uploadedImageUrl.split('/').pop();
      const response = await fetch(`/api/pics?filename=${filename}`, {
        method: 'GET',
      });

      if (response.ok) {
        // Trigger a download with the retrieved blob data
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'image.jpg'; 
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await response.json();
        setUploadError(errorData.error || 'Get failed.');
      }
    } catch (error) {
      console.error('Error retrieving file:', error);
      setUploadError('Get failed.');
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first.');
      return;
    }

    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.name); // Use 'file' as the field name

      const response = await fetch('/api/upload?filename=' + selectedFile.name, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedImageUrl(data.url); 
      } else {
        const errorData = await response.json();
        setUploadError(errorData.error || 'Upload failed.'); 
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Upload failed.');
    }
  };

  return (
    <div>
    <h1>Image Upload</h1>

    <input type="file" accept="image/*" onChange={handleFileChange} />

    {previewUrl && (
      <div>
        <h2>Preview:</h2>
        <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px' }} />
      </div>
    )}

    <button onClick={handleUpload} disabled={!selectedFile}>
      Upload
    </button>

    {/* 削除ボタンを追加 */}
    <button onClick={handleDelete} disabled={!uploadedImageUrl}> 
      Delete
    </button>

    {/* 取得ボタンを追加 */}
    <button onClick={handleGet} disabled={!uploadedImageUrl}> 
      Get Image
    </button>

    {uploadError && <div style={{ color: 'red' }}>{uploadError}</div>}

    {uploadedImageUrl && (
      <div>
        <h2>Uploaded Image:</h2>
        <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">
          {uploadedImageUrl}
        </a>
      </div>
    )}
  </div>
  );
};

export default ImageApp;
