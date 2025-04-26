"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileUp } from "lucide-react"

export default function DirectoryUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStats, setUploadStats] = useState({
    uploaded: 0,
    total: 0,
    inProgress: false,
  })

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const fileArray = Array.from(e.dataTransfer.files)
      setFiles(fileArray)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setFiles(fileArray)
    }
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setUploadStats({
      uploaded: 0,
      total: files.length,
      inProgress: true,
    })

    // Simulate upload process
    let count = 0
    const interval = setInterval(() => {
      count++
      setUploadStats((prev) => ({
        ...prev,
        uploaded: count,
      }))

      if (count >= files.length) {
        clearInterval(interval)
        setUploadStats((prev) => ({
          ...prev,
          inProgress: false,
        }))
      }
    }, 500)
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag and drop files here or click to select files</p>
          <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{files.length} file(s) selected</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {files.slice(0, 3).map((file, index) => (
                <li key={index} className="truncate">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </li>
              ))}
              {files.length > 3 && <li>...and {files.length - 3} more</li>}
            </ul>
          </div>
        )}

        <Button onClick={handleUpload} disabled={files.length === 0 || uploadStats.inProgress} className="w-auto">
          <FileUp className="mr-2 h-4 w-4" />
          Upload
        </Button>

        {(uploadStats.total > 0 || uploadStats.inProgress) && (
          <div className="mt-4 p-4 border rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Upload Progress</span>
              <span className="text-sm font-medium">
                {uploadStats.uploaded} / {uploadStats.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(uploadStats.uploaded / Math.max(1, uploadStats.total)) * 100}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {uploadStats.inProgress
                ? "Upload in progress..."
                : uploadStats.uploaded === uploadStats.total && uploadStats.total > 0
                  ? "Upload complete!"
                  : "Ready to upload"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
