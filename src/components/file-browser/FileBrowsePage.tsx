"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Folder as FolderIcon,
  File as FileIcon,
  Trash2,
  MoreVertical,
  UploadCloud,
  FolderPlus,
  Home,
  ArrowLeft,
  ExternalLink,
  Loader2, // Spinner icon
  AlertCircle,
  RefreshCw,
  Info, // For size limit message
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { useTranslation } from "@/lib/i18n";

interface FileItem {
  name: string;
  fullPath: string;
  size?: number;
  updated?: string;
  type: "file" | "folder";
}

const MAX_TOTAL_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

const DrivePage: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDataRefreshing, setIsDataRefreshing] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFilesForUpload, setSelectedFilesForUpload] =
    useState<FileList | null>(null);
  const [currentUploadTotalSize, setCurrentUploadTotalSize] = useState(0); // New state for total size
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, { progress: number; error?: string }>
  >({});
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async (path: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/files/list?prefix=${encodeURIComponent(path)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch items");
      }
      const data = await response.json();
      const combinedItems: FileItem[] = [
        ...(data.subdirectories || []).sort((a: FileItem, b: FileItem) =>
          a.name.localeCompare(b.name)
        ),
        ...(data.files || []).sort((a: FileItem, b: FileItem) =>
          a.name.localeCompare(b.name)
        ),
      ];
      setItems(combinedItems);
    } catch (error: any) {
      toast("Error Fetching Data", {
        description: error.message,
      });
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(currentPath);
  }, [currentPath, fetchItems]);

  const formatSize = (bytes?: number) => {
    if (bytes === undefined || bytes === null || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }
      setCurrentUploadTotalSize(totalSize);
      setSelectedFilesForUpload(files);

      if (totalSize > MAX_TOTAL_UPLOAD_SIZE) {
        toast(t("fileBrowser.upload.sizeLimitExceededTitle"), {
          description: t("fileBrowser.upload.sizeLimitExceededDescription", {
            limit: formatSize(MAX_TOTAL_UPLOAD_SIZE),
            currentSize: formatSize(totalSize),
          }),
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        });
      }
    } else {
      setSelectedFilesForUpload(null);
      setCurrentUploadTotalSize(0);
    }
  };

  const handleUploadFiles = async () => {
    if (!selectedFilesForUpload || selectedFilesForUpload.length === 0) {
      toast(t("fileBrowser.upload.noFiles"), {
        description: t("fileBrowser.upload.noFilesDescription"),
      });
      return;
    }

    if (currentUploadTotalSize > MAX_TOTAL_UPLOAD_SIZE) {
      toast(t("fileBrowser.upload.cannotUploadSizeLimitTitle"), {
        description: t("fileBrowser.upload.sizeLimitExceededAgain", {
          limit: formatSize(MAX_TOTAL_UPLOAD_SIZE),
          currentSize: formatSize(currentUploadTotalSize),
        }),
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      });
      return;
    }

    setIsUploading(true);
    const initialProgress: Record<
      string,
      { progress: number; error?: string }
    > = {};
    Array.from(selectedFilesForUpload).forEach((file) => {
      initialProgress[file.name] = { progress: 0 };
    });
    setUploadProgress(initialProgress);

    const formData = new FormData();
    for (let i = 0; i < selectedFilesForUpload.length; i++) {
      formData.append("files", selectedFilesForUpload[i]);
    }
    formData.append("prefix", currentPath);

    Array.from(selectedFilesForUpload).forEach((file) => {
      let currentFileProgress = 0;
      const interval = setInterval(() => {
        currentFileProgress += 10;
        if (currentFileProgress <= 90) {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: { ...prev[file.name], progress: currentFileProgress },
          }));
        } else {
          clearInterval(interval);
        }
      }, 200);
    });

    try {
      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      const finalProgress = { ...initialProgress };
      (result.uploadedFiles || []).forEach((uploadedFile: { name: string }) => {
        finalProgress[uploadedFile.name] = { progress: 100 };
      });
      Array.from(selectedFilesForUpload).forEach((file) => {
        if (
          !finalProgress[file.name] ||
          finalProgress[file.name].progress < 100
        ) {
          if (response.ok) finalProgress[file.name] = { progress: 100 };
        }
      });
      setUploadProgress(finalProgress);

      toast(t("fileBrowser.upload.success"), {
        description: t("fileBrowser.upload.successDescription", {
          count: result.uploadedFiles?.length || 0,
        }),
      });
      fetchItems(currentPath);
      setSelectedFilesForUpload(null);
      setCurrentUploadTotalSize(0); // Reset total size
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => setUploadProgress({}), 3000);
    } catch (error: any) {
      toast("Upload Error", {
        description: error.message,
      });
      const errorProgress = { ...initialProgress };
      Array.from(selectedFilesForUpload).forEach((file) => {
        errorProgress[file.name] = {
          progress: errorProgress[file.name]?.progress || 0,
          error: error.message || "Failed",
        };
      });
      setUploadProgress(errorProgress);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolderSubmit = async () => {
    if (!newFolderName.trim()) {
      toast(t("fileBrowser.folder.create.invalidName"), {
        description: t("fileBrowser.folder.create.invalidNameDescription"),
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/folders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folderName: newFolderName,
          prefix: currentPath,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create folder");
      }
      toast(t("fileBrowser.folder.create.success"), {
        description: t("fileBrowser.folder.create.successDescription", {
          name: newFolderName,
        }),
      });
      setShowCreateFolderDialog(false);
      setNewFolderName("");
      fetchItems(currentPath);
    } catch (error: any) {
      toast("Error Creating Folder", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (item: FileItem) => {
    const confirmDelete = window.confirm(
      t("fileBrowser.actions.deleteConfirm", {
        type: item.type,
        name: item.name,
      }) +
        (item.type === "folder"
          ? t("fileBrowser.actions.deleteFolderWarning")
          : "")
    );
    if (!confirmDelete) return;

    setIsLoading(true);
    const endpoint =
      item.type === "folder" ? "/api/folders/delete" : "/api/files/delete";
    const body =
      item.type === "folder"
        ? { folderPath: item.fullPath }
        : { filePath: item.fullPath };

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Failed to delete ${item.type}`);
      }
      toast(t("fileBrowser.actions.deleteSuccess"), {
        description: t("fileBrowser.actions.deleteSuccessDescription", {
          type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
          name: item.name,
        }),
      });
      fetchItems(currentPath);
    } catch (error: any) {
      toast(`Error Deleting ${item.type}`, {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFile = async (filePath: string) => {
    try {
      const response = await fetch(
        `/api/files/view?filePath=${encodeURIComponent(filePath)}`
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to get view link");
      }
      window.open(result.viewUrl, "_blank", "noopener,noreferrer");
    } catch (error: any) {
      toast("Error Viewing File", {
        description: error.message,
      });
    }
  };

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };

  const navigateUp = () => {
    if (currentPath === "") return;
    const parts = currentPath.split("/").filter((p) => p);
    parts.pop();
    setCurrentPath(parts.length > 0 ? parts.join("/") + "/" : "");
  };

  const getBreadcrumbs = () => {
    const pathParts = currentPath.split("/").filter((p) => p);
    const crumbs = [{ name: "Home", path: "" }];
    let currentCrumbPath = "";
    for (const part of pathParts) {
      currentCrumbPath += `${part}/`;
      crumbs.push({ name: part, path: currentCrumbPath });
    }
    return crumbs;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "--";
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "--";
    }
  };

  const isOverSizeLimit = currentUploadTotalSize > MAX_TOTAL_UPLOAD_SIZE;

  return (
    <div className="container mx-auto space-y-6">
      <header className="mb-2">
        <div className="flex items-center space-x-1 sm:space-x-2 mt-3 text-sm sm:text-base overflow-x-auto whitespace-nowrap py-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPath("")}
            disabled={currentPath === "" || isLoading}
            title={t("fileBrowser.navigation.goToRoot")}
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          {currentPath !== "" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={navigateUp}
              disabled={isLoading}
              title={t("fileBrowser.navigation.goUp")}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
          <div className="flex items-center text-muted-foreground">
            {getBreadcrumbs().map((crumb, index, arr) => (
              <span key={crumb.path} className="flex items-center">
                <Button
                  variant="link"
                  className={`p-1 h-auto text-sm sm:text-base ${
                    crumb.path === currentPath
                      ? "font-semibold text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => navigateToFolder(crumb.path)}
                  disabled={isLoading || crumb.path === currentPath}
                >
                  {crumb.name === "Home"
                    ? t("fileBrowser.navigation.home")
                    : crumb.name}
                </Button>
                {index < arr.length - 1 && <span className="mx-1">/</span>}
              </span>
            ))}
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {t("fileBrowser.title")}
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <div className="flex-grow sm:max-w-xs">
              <Input
                id="file-upload-input"
                type="file"
                multiple
                onChange={handleFileSelectionChange}
                ref={fileInputRef}
                className="w-full"
                disabled={isUploading || isLoading}
              />
              {selectedFilesForUpload && selectedFilesForUpload.length > 0 && (
                <div
                  className={`mt-1 text-xs flex items-center ${
                    isOverSizeLimit ? "text-red-600" : "text-muted-foreground"
                  }`}
                >
                  <Info className="h-3 w-3 mr-1" />
                  {t("fileBrowser.upload.selectedSize", {
                    currentSize: formatSize(currentUploadTotalSize),
                    limit: formatSize(MAX_TOTAL_UPLOAD_SIZE),
                  })}
                </div>
              )}
            </div>
            <Button
              onClick={handleUploadFiles}
              disabled={
                !selectedFilesForUpload ||
                selectedFilesForUpload.length === 0 ||
                isUploading ||
                isLoading ||
                isOverSizeLimit // Disable if over size limit
              }
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              {t("fileBrowser.upload.button", {
                count: selectedFilesForUpload?.length || 0,
              })}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCreateFolderDialog(true)}
              disabled={isUploading || isLoading}
              className="w-full sm:w-auto"
            >
              <FolderPlus className="mr-2 h-4 w-4" />{" "}
              {t("fileBrowser.folder.create.button")}
            </Button>
            {items?.length > 0 &&
              items.every((item) => item.type === "file") && (
                <div className="ml-auto flex flex-col items-center">
                  <Button
                    className="cursor-pointer bg-amber-500 shadow-md hover:bg-amber-400"
                    variant="secondary"
                    disabled={isDataRefreshing}
                    onClick={async () => {
                      setIsDataRefreshing(true);
                      try {
                        let path = currentPath;
                        if (path.length > 1 && path.endsWith("/")) {
                          path = path.slice(0, -1);
                        }
                        await fetch("/api/data/new", {
                          method: "POST",
                          body: JSON.stringify({
                            path: path,
                          }),
                        });
                        toast(t("fileBrowser.dataRefresh.started"), {
                          description: t(
                            "fileBrowser.dataRefresh.startedDescription"
                          ),
                        });
                      } catch (error) {
                        toast(t("fileBrowser.dataRefresh.error"), {
                          description: t(
                            "fileBrowser.dataRefresh.errorDescription"
                          ),
                        });
                      } finally {
                        setIsDataRefreshing(false);
                      }
                    }}
                  >
                    {isDataRefreshing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    {t("fileBrowser.dataRefresh.button")}
                  </Button>
                  <Label className="mt-2 text-xs text-muted-foreground">
                    {t("fileBrowser.dataRefresh.remaining")}
                  </Label>
                </div>
              )}
          </div>
        </CardHeader>
      </Card>

      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md sm:text-lg">
              {t("fileBrowser.upload.progress")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {Object.entries(uploadProgress).map(([fileName, status]) => (
              <div key={fileName} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span>{fileName}</span>
                  {status.error && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <Progress
                  value={status.progress}
                  className={`w-full h-2 ${
                    status.error ? "bg-red-200 [&>*]:bg-red-600" : ""
                  }`}
                />
                {status.error && (
                  <p className="text-xs text-red-600 mt-1">{status.error}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {t("fileBrowser.navigation.currentFolder", {
              name:
                currentPath === ""
                  ? t("fileBrowser.navigation.home")
                  : currentPath
                      .split("/")
                      .filter((p) => p)
                      .pop() || "",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading &&
            !isUploading &&
            items.length === 0 && ( // Ensure loader doesn't show over progress
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">{t("fileBrowser.table.loading")}</p>
              </div>
            )}

          {!isLoading && items.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <FolderIcon className="mx-auto h-12 w-12 mb-2" />
              <p>{t("fileBrowser.folder.empty.title")}</p>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px] sm:w-[50px]"></TableHead>
                    <TableHead>{t("fileBrowser.table.name")}</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      {t("fileBrowser.table.size")}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      {t("fileBrowser.table.lastModified")}
                    </TableHead>
                    <TableHead className="text-right w-[60px] sm:w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.fullPath}
                      className="group hover:bg-muted/50"
                    >
                      <TableCell className="mx-auto">
                        {item.type === "folder" ? (
                          <FolderIcon className="h-5 w-5 ml-2 text-blue-500" />
                        ) : (
                          <FileIcon className="h-5 w-5 ml-2 text-gray-500" />
                        )}
                      </TableCell>
                      <TableCell
                        className="font-medium cursor-pointer hover:underline max-w-[150px] sm:max-w-[250px] md:max-w-xs lg:max-w-md truncate"
                        title={item.name}
                        onClick={() =>
                          item.type === "folder"
                            ? navigateToFolder(item.fullPath)
                            : handleViewFile(item.fullPath)
                        }
                      >
                        {item.name}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                        {item.type === "file" ? formatSize(item.size) : "--"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(item.updated)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isLoading}
                              className="cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {item.type === "file" && (
                              <DropdownMenuItem
                                onClick={() => handleViewFile(item.fullPath)}
                                disabled={isLoading}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {t("fileBrowser.actions.viewDownload")}
                              </DropdownMenuItem>
                            )}
                            {item.type === "folder" && (
                              <DropdownMenuItem
                                onClick={() => navigateToFolder(item.fullPath)}
                                disabled={isLoading}
                              >
                                <FolderIcon className="mr-2 h-4 w-4" />
                                {t("fileBrowser.actions.openFolder")}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteItem(item)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              disabled={isLoading}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t("fileBrowser.actions.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("fileBrowser.folder.create.title")}</DialogTitle>
            <DialogDescription>
              {t("fileBrowser.folder.create.description", {
                path: currentPath || t("fileBrowser.navigation.home"),
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="new-folder-name"
              placeholder={t("fileBrowser.folder.create.placeholder")}
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !isLoading &&
                newFolderName.trim() &&
                handleCreateFolderSubmit()
              }
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                {t("fileBrowser.folder.create.cancel")}
              </Button>
            </DialogClose>
            <Button
              onClick={handleCreateFolderSubmit}
              disabled={isLoading || !newFolderName.trim()}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("fileBrowser.folder.create.button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DrivePage;
