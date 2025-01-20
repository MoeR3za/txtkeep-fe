import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { IUserLogin } from "@/models/user";
import { AxiosResponse } from "axios";

// Mock the modules
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.mock("@/components/ui/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock("@/services/auth", () => ({
  login: vi.fn(),
}));

describe("LoginPage", () => {
  it("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const mockRouter: any = { push: vi.fn() };
    const mockToast: any = { toast: vi.fn() };
    const mockedResponse = {
      data: {
        user: {
          pk: 1,
          email: "test@example.com",
          username: "testuser",
          first_name: "Test",
          last_name: "User",
        },
        refresh: "refresh-token",
        access: "mock-token",
      },
      status: 200,
      statusText: "OK",
    } as AxiosResponse<IUserLogin>;

    vi.mocked(useRouter).mockReturnValue(mockRouter);
    vi.mocked(useToast).mockReturnValue(mockToast);
    vi.mocked(login).mockResolvedValue(mockedResponse);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Success",
        description: "Logged in successfully",
      });
      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("handles login failure", async () => {
    const mockToast: any = { toast: vi.fn() };
    const mockedResponse = {
      data: {
        success: false,
        message: "Invalid credentials",
        refresh: "refresh-token",
        access: "mock-token",
      },
      status: 200,
      statusText: "OK",
    } as AxiosResponse;

    vi.mocked(useToast).mockReturnValue(mockToast);
    vi.mocked(login).mockResolvedValue(mockedResponse);

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: "Error",
        description: "Invalid credentials",
        variant: "destructive",
      });
    });
  });
});
