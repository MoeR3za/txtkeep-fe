import { describe, it, expect, beforeEach } from "vitest"
import { uploadFile, searchFiles, getFiles, deleteFile } from "./files"

describe("File Actions", () => {
    let formData: FormData

    beforeEach(() => {
        formData = new FormData()
    })

    describe("uploadFile", () => {
        it("should successfully upload a file", async () => {
            const file = new File(["test content"], "test.txt", { type: "text/plain" })
            formData.append("file", file)

            const result = await uploadFile(formData)

            expect(result.status).toBe(200);
        })

        it("should fail when no file is provided", async () => {
            const result = await uploadFile(formData)

            expect(result.status).toBe(401);
        })
    })

    describe("searchFiles", () => {
        it("should find files matching the query", async () => {
            // Upload a test file first
            const file = new File(["test content"], "test.txt", { type: "text/plain" })
            formData.append("file", file)
            await uploadFile(formData)

            const { data: { results } } = await searchFiles("test")

            expect(results.length).toBeGreaterThan(0)
            expect(results[0].file_name).toBe("test.txt")
        })

        it("should return empty array for non-matching query", async () => {
            const results = await searchFiles("nonexistent")

            expect(results).toHaveLength(0)
        })
    })

    describe("deleteFile", () => {
        it("should successfully delete an existing file", async () => {
            // Upload a test file first
            const file = new File(["test content"], "test.txt", { type: "text/plain" })
            formData.append("file", file)
            await uploadFile(formData)

            const { data } = await getFiles()
            const files = data.results;
            const fileId = files[0].uuid

            const result = await deleteFile(fileId)

            expect(result.status).toBe(200)

            const updatedFiles = await getFiles()
            expect(updatedFiles).toHaveLength(files.length - 1)
        })

        it("should fail when deleting non-existent file", async () => {
            const result = await deleteFile("nonexistent-id")

            expect(result.status).toBe(404)
        })
    })
})

