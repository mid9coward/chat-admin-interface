"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  File,
  X,
  Upload,
  Check,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileIcon as FilePdf,
  FileArchive,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
};

export function AdminDashboard() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setUploadSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        title: "Không có tệp nào",
        description: "Vui lòng chọn ít nhất một tệp để tải lên",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file.file);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const result = await response.json();
      setIsUploading(false);
      setUploadSuccess(true);
      setFiles([]); // Xóa danh sách file sau khi upload thành công
      toast({
        title: "Tải lên thành công",
        description: `Đã tải lên ${files.length} tệp`,
        variant: "default",
      });
    } catch (error: any) {
      setIsUploading(false);
      toast({
        title: "Lỗi tải lên",
        description:
          error.message || "Đã xảy ra lỗi khi tải lên tệp. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FilePdf className="h-10 w-10 text-red-500" />;
      case "xlsx":
      case "xls":
        return <FileSpreadsheet className="h-10 w-10 text-green-600" />;
      case "docx":
      case "doc":
        return <FileText className="h-10 w-10 text-blue-600" />;
      case "pptx":
      case "ppt":
        return <FileImage className="h-10 w-10 text-orange-500" />;
      case "zip":
      case "rar":
        return <FileArchive className="h-10 w-10 text-purple-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary-color/20 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-secondary-color to-secondary-color/80 p-6">
          <CardTitle className="text-white text-2xl flex items-center">
            <Upload className="mr-2 h-6 w-6" />
            Quản lý tài liệu
          </CardTitle>
          <p className="text-white/80 mt-2">
            Tải lên và quản lý các tài liệu của bạn
          </p>
        </div>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging
                  ? "border-secondary-color bg-secondary-color/10"
                  : "border-primary-color/30 hover:border-secondary-color/50 hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Upload className="mx-auto h-16 w-16 text-secondary-color mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  Kéo thả tệp vào đây
                </h3>
                <p className="text-gray-500 mb-4">hoặc</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-secondary-color text-secondary-color hover:bg-secondary-color hover:text-white transition-all duration-200"
                >
                  Chọn tệp
                </Button>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".xlsx,.xls,.pptx,.pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500 mt-4">
                  Hỗ trợ: Excel, PPTX, PDF, DOCX, TXT
                </p>
              </motion.div>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <h3 className="font-medium text-lg flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary-color" />
                    Tệp đã chọn ({files.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto p-2">
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="mr-4">{getFileIcon(file.name)}</div>
                        <div className="flex-grow min-w-0">
                          <p className="font-medium truncate text-dark-color">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 p-0 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  type="submit"
                  className={`${
                    uploadSuccess
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-secondary-color hover:bg-secondary-color/90"
                  } py-6 px-8 rounded-xl shadow-lg transition-all duration-300`}
                  disabled={isUploading || files.length === 0}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Đang tải lên...
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Đã tải lên thành công
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Tải lên tài liệu
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
