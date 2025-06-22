import { describe, it, expect } from "vitest"
import { getValidationSchema } from "./validationSchema"

describe("getValidationSchema", () => {
  describe("Sign In Schema", () => {
    const signInSchema = getValidationSchema(true)

    it("validates required email field", async () => {
      const result = await signInSchema.isValid({
        email: "",
        password: "password123",
      })
      expect(result).toBe(false)
    })

    it("validates email format", async () => {
      const result = await signInSchema.isValid({
        email: "invalid-email",
        password: "password123",
      })
      expect(result).toBe(false)
    })

    it("validates required password field", async () => {
      const result = await signInSchema.isValid({
        email: "test@example.com",
        password: "",
      })
      expect(result).toBe(false)
    })

    it("accepts valid sign in data", async () => {
      const result = await signInSchema.isValid({
        email: "test@example.com",
        password: "password123",
      })
      expect(result).toBe(true)
    })
  })

  describe("Sign Up Schema", () => {
    const signUpSchema = getValidationSchema(false)

    it("validates required username field", async () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        userName: "",
        firstName: "John",
        lastName: "Doe",
        phone: "123 456 7890",
      }

      const result = await signUpSchema.isValid(validData)
      expect(result).toBe(false)
    })

    it("validates password confirmation match", async () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "differentpassword",
        userName: "testuser",
        firstName: "John",
        lastName: "Doe",
        phone: "123 456 7890",
      }

      const result = await signUpSchema.isValid(validData)
      expect(result).toBe(false)
    })

    it("accepts valid sign up data", async () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        userName: "testuser",
        firstName: "John",
        lastName: "Doe",
        phone: "123 456 7890",
      }

      const result = await signUpSchema.isValid(validData)
      expect(result).toBe(true)
    })

    it("validates phone number format", async () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
        userName: "testuser",
        firstName: "John",
        lastName: "Doe",
        phone: "invalid-phone",
      }

      const result = await signUpSchema.isValid(validData)
      expect(result).toBe(false)
    })
  })
})
