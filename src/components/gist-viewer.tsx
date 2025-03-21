"use client"

import { useState } from "react"
import { Copy, X } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock code content for gists
const mockGistContent = {
  "1": {
    files: [
      {
        name: "useLocalStorage.ts",
        language: "TypeScript",
        content: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue] as const;
}`,
      },
      {
        name: "useMediaQuery.ts",
        language: "TypeScript",
        content: `import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}`,
      },
    ],
  },
  "2": {
    files: [
      {
        name: "api-route.ts",
        language: "TypeScript",
        content: `import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    res.status(200).json({ name: 'John Doe', message: 'Hello from the API!' });
  } else {
    res.status(405).json({ name: 'Error', message: 'Method not allowed' });
  }
}`,
      },
    ],
  },
  "3": {
    files: [
      {
        name: "grid-layouts.css",
        language: "CSS",
        content: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 1rem;
}

.grid-item {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 4px;
}

/* Holy Grail Layout */
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav content sidebar"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.holy-grail-header { grid-area: header; }
.holy-grail-nav { grid-area: nav; }
.holy-grail-content { grid-area: content; }
.holy-grail-sidebar { grid-area: sidebar; }
.holy-grail-footer { grid-area: footer; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .holy-grail {
    grid-template-areas:
      "header"
      "nav"
      "content"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
}`,
      },
    ],
  },
  "4": {
    files: [
      {
        name: "utils.js",
        language: "JavaScript",
        content: `/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @return {Function} - The debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Format a number with commas as thousands separators
 * @param {number} num - The number to format
 * @return {string} - The formatted number
 */
function formatNumber(num) {
  return num.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",");
}

/**
 * Generate a random string of specified length
 * @param {number} length - The length of the string to generate
 * @return {string} - The random string
 */
function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Deep clone an object
 * @param {Object} obj - The object to clone
 * @return {Object} - The cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export { debounce, formatNumber, randomString, deepClone };`,
      },
    ],
  },
  "5": {
    files: [
      {
        name: "auth.js",
        language: "JavaScript",
        content: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Generate a JWT token
 * @param {Object} user - User object
 * @param {string} secret - JWT secret
 * @param {string} expiresIn - Token expiration time
 * @return {string} - JWT token
 */
function generateToken(user, secret, expiresIn = '24h') {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    }, 
    secret, 
    { expiresIn }
  );
}

/**
 * Verify password against hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @return {Promise<boolean>} - Whether password matches
 */
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @param {number} saltRounds - Number of salt rounds for bcrypt
 * @return {Promise<string>} - Hashed password
 */
async function hashPassword(password, saltRounds = 10) {
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

module.exports = {
  generateToken,
  verifyPassword,
  hashPassword,
  authenticateToken
};`,
      },
    ],
  },
  "6": {
    files: [
      {
        name: "docker-compose.yml",
        language: "YAML",
        content: `version: '3.8'

services:
  # Web application
  app:
    build: 
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://postgres:postgres@db:5432/myapp
    volumes:
      - ./app:/app
      - /app/node_modules
    depends_on:
      - db
    networks:
      - app-network

  # Database
  db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=myapp
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network

  # Redis for caching
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - app-network

  # Adminer for database management
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres-data:
  redis-data:`,
      },
    ],
  },
}

interface GistViewerProps {
  isOpen: boolean
  onClose: () => void
  gist: any
}

export function GistViewer({ isOpen, onClose, gist }: GistViewerProps) {
  const [activeFile, setActiveFile] = useState(0)

  const gistContent = mockGistContent[gist?.id]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!", {
      duration: 2000,
    })
  }

  if (!gist || !gistContent) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{gist.name}</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogDescription>{gist.description}</DialogDescription>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{gist.language}</Badge>
            <span className="text-xs text-muted-foreground">Created by {gist.owner.login}</span>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden mt-4">
          {gistContent.files.length > 1 && (
            <TabsList className="mb-4 bg-card border">
              {gistContent.files.map((file, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  onClick={() => setActiveFile(index)}
                  className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`}
                >
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          <div className="relative overflow-hidden rounded-md border flex-1">
            <div className="absolute right-2 top-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(gistContent.files[activeFile].content)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy code</span>
              </Button>
            </div>
            <pre className="p-4 overflow-auto h-full bg-muted text-foreground text-sm">
              <code>{gistContent.files[activeFile].content}</code>
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

