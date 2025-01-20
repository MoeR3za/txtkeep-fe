"use client";

import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { Label } from "@/components/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileUp } from "lucide-react";
import { uploadFile } from "@/services/files";
import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MIN_FILE_SIZE = 500;
const MAX_FILE_SIZE = 2000;

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const $FileInput = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async () => {
    try {
      const file = $FileInput.current!.files?.[0];

      if (!file || file.type !== "text/plain") {
        throw new Error("Please select a .txt file.");
      }

      if (file.size < MIN_FILE_SIZE) {
        throw new Error(
          "This file is below the minimum allowed file size of 0.5kb!"
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error(
          "This file exceedes the maximum allowed file size of 2.0kb!"
        );
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append("files", file);

      await uploadFile(formData);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      setFileName("");
      $FileInput.current!.value = "";
      router.push("/dashboard/my-files");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to handle file selection
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0]; // Get the first file selected
      if (file) {
        setFileName(file.name);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      });
      setFileName("");
      $FileInput.current!.value = "";
    }
  };

  const [dragging, setDragging] = useState<boolean>(false);
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = e.dataTransfer.files;

    try {
      if (files.length && files[0].type === "text/plain") {
        $FileInput.current!.files = files;
        setFileName(files[0].name);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      setFileName("");
      $FileInput.current!.value = "";
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as HTMLElement;

    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      setDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <FileUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Upload File</CardTitle>
              <CardDescription>Upload a text file to store and search later</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className="space-y-4"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="space-y-2">
              <Label htmlFor="file">File: {fileName || "Select a file"}</Label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-neutral-300 px-6 py-10 transition-colors hover:border-purple-300">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-neutral-400" />
                  <div className="mt-4 flex justify-center text-sm leading-6 text-neutral-600">
                    <label
                      htmlFor="file"
                      className="relative cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-purple-600 shadow-sm hover:bg-purple-50 transition-colors"
                    >
                      <span>Select a file</span>
                      <Input
                        ref={$FileInput}
                        onChange={handleInputChange}
                        id="file"
                        name="file"
                        type="file"
                        accept=".txt"
                        required
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-neutral-600">
                    or drag and drop .txt files only.
                    <br />
                    Minimum file size: 0.5KB
                    <br />
                    Maximum file size: 2.0KB
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleUpload}
              loading={isUploading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>

            <div
              className={cn(
                "absolute pointer-events-none transition-opacity ease-in duration-300 bg-white bg-opacity-70 font-bold text-lg flex items-center justify-center w-full h-full z-10 top-0 left-0 opacity-0",
                { "opacity-100": dragging }
              )}
            >
              Drop the file here
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
