"use client"

import type React from "react"

import { useState } from "react"
import { Github } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (credentials: { username: string; password: string }) => void
  onGithubLogin: () => void
}

export function LoginModal({ isOpen, onClose, onLogin, onGithubLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple validation
    const newErrors: { username?: string; password?: string } = {}

    if (!username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!password.trim()) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Clear errors and submit
    setErrors({})
    onLogin({ username, password })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login to GitHub</DialogTitle>
          <DialogDescription>Enter your GitHub credentials to access your gists.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="github-username"
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Separator className="my-2" />
            <Button type="button" variant="outline" className="w-full" onClick={onGithubLogin}>
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

