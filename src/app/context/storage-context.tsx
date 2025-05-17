"use client"

import { createContext, useState, useContext, type ReactNode } from "react"

export type File = {
  id: string;
  size: number;
  path: string;
  contentType: string;
  updated: number;
  downloadLink: string;
  contentEncoding: string;
  cacheControl: string;
};

export type StorageContextType = {
  getFiles: () => Promise<{ bucket: string, files: File[] }>
  addFile: (filePath: string, fileContentType: string, fileSize: number) => Promise<any>
  moveFile: (filePath: string, destination: string) => Promise<any>
  deleteFile: (filePath: string) => Promise<any>
  addFolder: (folderPath: string) => Promise<any>
  uploadFile: (uploadPolicy: { url: string, fields: Record<string, any> }, file: File, progressCallback: any) => Promise<any>
}


const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {

  const getFiles = async () => {
    const response = await fetch("/api/files")
    const data = await response.json()
    return data;
  }

  const addFile = async (filepath: string, fileContentType: string, fileSize: number) => {
    const response = await fetch("/api/files", {
      method: "POST",
      body: JSON.stringify({ filepath, fileContentType, fileSize }),
    })
    const data = await response.json()
    return data
  }

  const moveFile = async (filepath: string, destination: string) => {
    const response = await fetch("/api/files", {
      method: "PATCH",
      body: JSON.stringify({ filepath, destination }),
    })
    const data = await response.json()
    return data
  }

  const deleteFile = async (filepath: string) => {
    const response = await fetch("/api/files", {
      method: "DELETE",
      body: JSON.stringify({ filepath }),
    })
    const data = await response.json()
    return data
  }

  const addFolder = async (folderpath: string) => {
    const response = await fetch("/api/files", {
      method: "PUT",
      body: JSON.stringify({ folderpath }),
    })
    const data = await response.json()
    return data
  }

  const uploadFile = async (uploadPolicy: { url: string, fields: Record<string, any> }, file: File) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const data = new FormData()
    for (const [key, value] of Object.entries(uploadPolicy.fields)) {
      data.append(key, value)
    }
    data.append('file', file as any)

    const uploadPromise = fetch(uploadPolicy.url, {
      signal,
      method: "POST",
      body: data,
    })

    return [uploadPromise, () => controller.abort()]
  }

  return (
    <StorageContext.Provider value={{ getFiles, addFile, moveFile, deleteFile, addFolder, uploadFile }}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}
