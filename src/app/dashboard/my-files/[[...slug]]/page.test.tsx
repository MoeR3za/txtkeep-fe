import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MyFilesPage from "./page";
import * as files from "@/services/files";
import { useToast } from "@/hooks/use-toast";
import { IPaginated } from "@/models/paginated";
import { AxiosResponse } from "axios";
import { IFile } from "@/models/files";
import { ISuccessResponse } from "@/models/api";

// Mock the modules
vi.mock("@/components/ui/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock("@/services/files", () => ({
  getFiles: vi.fn(),
  searchFiles: vi.fn(),
  deleteFile: vi.fn(),
}));

describe("MyFilesPage", () => {
  const mockFiles = [
    {
      uuid: "1",
      file_name: "test.txt",
      file_content: "test content",
      created_at: new Date().toISOString(),
    },
  ];

  const mockResponse = {
    data: {
      results: mockFiles,
      count: 1,
      next: null,
      previous: null,
    },
    status: 200,
    statusText: "OK",
  } as AxiosResponse<IPaginated<IFile>>;

  beforeEach(() => {
    vi.mocked(files.getFiles).mockResolvedValue(mockResponse);
  });

  it("renders files list", async () => {
    render(<MyFilesPage />);

    await waitFor(() => {
      expect(screen.getByText("test.txt")).toBeInTheDocument();
    });
  });

  it("handles search", async () => {
    vi.mocked(files.searchFiles).mockResolvedValue(mockResponse);

    render(<MyFilesPage />);

    const searchInput = screen.getByPlaceholderText(/search files/i);
    fireEvent.change(searchInput, { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(files.searchFiles).toHaveBeenCalledWith("test");
    });
  });

  it("handles file deletion", async () => {
    const mockToast: any = {
      toast: vi.fn(),
      dismiss: vi.fn(),
      state: { toasts: [] },
    };
    const mockedResponse = {
      data: {
        success: true,
        message: "File deleted successfully",
      },
      status: 200,
      statusText: "OK",
    } as AxiosResponse<ISuccessResponse>;

    vi.mocked(useToast).mockReturnValue(mockToast);
    vi.mocked(files.deleteFile).mockResolvedValue(mockedResponse);

    render(<MyFilesPage />);

    await waitFor(() => {
      expect(screen.getByText("test.txt")).toBeInTheDocument();
    });

    // Open delete dialog
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Confirm deletion
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Success",
        description: "File deleted successfully",
      });
    });
  });

  it("displays empty state when no files", async () => {
    const mockedResponse = {
      data: {
        results: [] as IFile[],
        count: 0,
        next: null,
        previous: null,
      },
      status: 200,
      statusText: "OK",
    } as AxiosResponse<IPaginated<IFile>>;

    vi.mocked(files.getFiles).mockResolvedValue(mockedResponse);

    render(<MyFilesPage />);

    await waitFor(() => {
      expect(screen.getByText(/no files found/i)).toBeInTheDocument();
    });
  });

  it("handles loading state", async () => {
    vi.mocked(files.getFiles).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100))
    );

    render(<MyFilesPage />);

    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.click(searchButton);

    expect(searchButton).toBeDisabled();

    await waitFor(() => {
      expect(searchButton).not.toBeDisabled();
    });
  });
});
