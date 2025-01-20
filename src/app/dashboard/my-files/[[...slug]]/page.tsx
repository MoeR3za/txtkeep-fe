"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Input } from "@/components/input";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, Calendar, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { searchFiles, getFiles, deleteFile } from "@/services/files";
import { Button } from "@/components/button";
import { IFile } from "@/models/files";
import Loading from "./loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function FileViewer({ params }: { params?: { slug: string } }) {
  const [files, setFiles] = useState<IFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    setIsLoading(true);
    try {
      const { data } = await getFiles();
      setFiles(data.results);

      if (params?.slug) {
        console.log(params.slug);
        const file = data.results.find((file) => file.uuid === params.slug[0]);
        if (file) {
          setSelectedFile(file);
        } else {
          toast({
            title: "Error",
            description: "Failed to load file",
            variant: "destructive",
          });
          router.push("/dashboard/my-files");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!searchQuery.trim()) {
        await loadFiles();
        return;
      }

      const { data } = await searchFiles(searchQuery);
      setFiles(data.results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteFile(id);
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
      loadFiles();
    }
  }

  if (isLoading) {
    return Loading();
  }

  return (
    <div className="grid lg:grid-cols-[350px_1fr] gap-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">My Files</CardTitle>
              <CardDescription>
                Search and manage your uploaded files
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-neutral-200 bg-white/50 backdrop-blur-xl transition-colors focus:border-purple-600"
              />
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="divide-y divide-neutral-200">
            {files.map((file) => (
              <div
                key={file.uuid}
                className={`py-4 transition-colors hover:bg-white/50 rounded-lg px-4 ${
                  pathname === `/dashboard/my-files/${file.uuid}`
                    ? "bg-white/50"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Link
                    href={`/dashboard/my-files/${file.uuid}`}
                    className="flex-1 flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-purple-100">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 truncate">
                        {file.file_name}
                      </h3>
                      <p className="text-sm text-neutral-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        {new Date(file.created_at).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-1">
                        {file.file_content}
                      </p>
                    </div>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 text-neutral-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your file.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(file.uuid)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deletingId === file.uuid ? (
                            <Button loading>Deleting...</Button>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}

            {files.length === 0 && (
              <div className="py-12 text-center text-neutral-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-lg font-medium">No files found</p>
                <p className="text-sm">
                  Upload some files or try a different search
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedFile ? (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-xl h-[calc(100vh-8rem)]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-xl truncate">
                  {selectedFile.file_name}
                </CardTitle>
                <p className="text-sm text-neutral-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedFile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-neutral max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-white/50 rounded-lg p-4">
                {selectedFile.file_content}
              </pre>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-xl h-[calc(100vh-8rem)]">
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
              <h2 className="text-lg font-medium text-neutral-900">
                Select a file to view
              </h2>
              <p className="text-sm text-neutral-500">
                Choose a file from the list to view its contents
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
