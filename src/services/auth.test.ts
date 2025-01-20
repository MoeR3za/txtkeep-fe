import { describe, it, expect, beforeEach } from "vitest"
import { login, register } from "./auth"

describe("Auth Actions", () => {
    let formData: FormData

    beforeEach(() => {
        formData = new FormData()
    })

    describe("login", () => {
        it("should return success with valid credentials", async () => {
            const result = await login( "test", "password123");
            expect(result.status).toBe(200);
        })
        
        it("should return failure with invalid credentials", async () => {
            const result = await login( "test", "password123");
            expect(result.status).toBe(403);
        })
    })

    //   describe("signup", () => {
    //     it("should return success with valid data", async () => {
    //       formData.append("email", "test@example.com")
    //       formData.append("password", "password123")
    //       formData.append("confirmPassword", "password123")

    //       const result = await signup(formData)

    //       expect(result.success).toBe(true)
    //       expect(result.message).toBe("Account created successfully")
    //       expect(result.token).toBeDefined()
    //     })

    //     it("should return failure when passwords do not match", async () => {
    //       formData.append("email", "test@example.com")
    //       formData.append("password", "password123")
    //       formData.append("confirmPassword", "different")

    //       const result = await signup(formData)

    //       expect(result.success).toBe(false)
    //       expect(result.message).toBe("Passwords do not match")
    //     })
    //   })
})

