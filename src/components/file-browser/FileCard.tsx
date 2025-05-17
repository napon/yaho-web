// FileCard.tsx
import React, { useState } from 'react'
import { getIconByMIMEType } from '@/util/fileUtil'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import {
  DownloadIcon,
  LockIcon,
  UnlockIcon,
  ArrowRightIcon,
  Edit2Icon,
  Trash2Icon,
  Link2Icon,
  ChevronDownIcon,
  FileIcon as LucideFileIcon,
  FolderIcon as LucideFolderIcon,
} from 'lucide-react'

export interface FileCardProps {
  cardType: 'list' | 'grid'
  isFolder: boolean
  name: string
  size: string
  fileType: string
  lastMod: string
  isDimmed: boolean
  checkIsPublic: () => Promise<boolean>
  onDelete: () => void
  onRename: () => void
  onMove: () => void
  onClickItem: () => void
  onDownload: (publicDownload: boolean) => void
  onSetPublic: (pub: boolean) => void
}

const FileCard: React.FC<FileCardProps> = ({
  cardType,
  isFolder,
  name,
  size,
  fileType,
  lastMod,
  isDimmed,
  checkIsPublic,
  onDelete,
  onRename,
  onMove,
  onClickItem,
  onDownload,
  onSetPublic,
}) => {
  const [isPublic, setIsPublic] = useState(false)

  // decide which lucide icon to render
  const FileTypeIcon = isFolder ? LucideFolderIcon : LucideFileIcon

  // helper to refresh isPublic state
  const refreshPublic = async () => {
    const pub = await checkIsPublic()
    setIsPublic(pub)
  }

  // build the shared dropdown-content
  const actionMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-orange-600 hover:text-orange-400 p-0"
          onClick={refreshPublic}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={refreshPublic}>
          Refresh Public
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => onDownload(isPublic)}
          disabled={isFolder}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onSetPublic(!isPublic)}
          disabled={isFolder}
        >
          {isPublic ? (
            <LockIcon className="mr-2 h-4 w-4" />
          ) : (
            <UnlockIcon className="mr-2 h-4 w-4" />
          )}
          {isPublic ? 'Make private' : 'Make public'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onMove} disabled={isFolder}>
          <ArrowRightIcon className="mr-2 h-4 w-4" />
          Move
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onRename} disabled={isFolder}>
          <Edit2Icon className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>
          <Trash2Icon className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (cardType === 'list') {
    return (
      <li
        className={`flex items-center p-2 w-full ${
          isFolder ? 'border border-gray-200 rounded' : ''
        }`}
        // if you still need drag-over styling, handle the events:
        onDragOver={(e) => {
          if (isFolder) e.currentTarget.classList.add('border-black')
        }}
        onDragLeave={(e) => {
          if (isFolder) e.currentTarget.classList.remove('border-black')
        }}
      >
        <div className="flex-shrink-0 mr-3">
          <FileTypeIcon className="h-6 w-6 text-gray-600" />
        </div>
        <div className="relative flex-1">
          {isDimmed && (
            <div className="absolute inset-0 bg-white opacity-50 z-10" />
          )}
          <div className="flex justify-between items-center">
            <a
              href="#"
              onClick={onClickItem}
              className="text-blue-600 hover:text-blue-800"
            >
              {name}
            </a>
            {actionMenu}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {isFolder
              ? 'folder'
              : `${size} · ${fileType} · last modified ${lastMod}`}
          </p>
        </div>
      </li>
    )
  }

  // grid/card view
  return (
    <Card
      className={`flex flex-col justify-between ${
        isFolder ? 'border border-gray-200' : ''
      } ${isDimmed ? 'opacity-50' : ''}`}
    >
      <CardHeader className="flex justify-between items-center p-4">
        <a
          href="#"
          onClick={onClickItem}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {name}
        </a>
        {actionMenu}
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center text-sm text-gray-600">
          <FileTypeIcon className="mr-2 h-5 w-5" />
          {isFolder ? (
            <span>folder</span>
          ) : (
            <>
              <span>{size}</span>
              <span className="mx-1">·</span>
              <span>{fileType}</span>
              <span className="mx-1">·</span>
              <span>last modified {lastMod}</span>
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4">
        <div className="flex space-x-2">
          {!isFolder && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(isPublic)}
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onClickItem}>
                <Link2Icon className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FileCard
