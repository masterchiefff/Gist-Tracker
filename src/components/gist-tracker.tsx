"use client"

import { useState } from "react"
import { BookOpen, Code, Github, Heart, Menu, MoreHorizontal, Search, Star, User } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { GistViewer } from "@/components/gist-viewer"
import { LoginModal } from "@/components/login-modal"
import { SonnerProvider } from "@/components/sonner-provider"

// Mock data for gists
const mockGists = [
  {
    id: "1",
    name: "React Hooks Collection",
    description: "A collection of custom React hooks for common use cases",
    language: "TypeScript",
    stars: 42,
    forks: 12,
    updatedAt: "2023-12-10T12:00:00Z",
    owner: {
      login: "developer1",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "2",
    name: "Next.js API Routes",
    description: "Examples of Next.js API routes with TypeScript",
    language: "TypeScript",
    stars: 28,
    forks: 5,
    updatedAt: "2023-12-05T10:30:00Z",
    owner: {
      login: "developer2",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "3",
    name: "CSS Grid Layouts",
    description: "Common CSS Grid layouts with examples",
    language: "CSS",
    stars: 36,
    forks: 8,
    updatedAt: "2023-12-08T09:15:00Z",
    owner: {
      login: "developer3",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "4",
    name: "JavaScript Utility Functions",
    description: "A collection of useful JavaScript utility functions",
    language: "JavaScript",
    stars: 19,
    forks: 3,
    updatedAt: "2023-12-01T14:45:00Z",
    owner: {
      login: "developer4",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "5",
    name: "Node.js Authentication",
    description: "Authentication examples for Node.js applications",
    language: "JavaScript",
    stars: 54,
    forks: 15,
    updatedAt: "2023-12-12T11:20:00Z",
    owner: {
      login: "developer5",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "6",
    name: "Docker Compose Templates",
    description: "Docker Compose templates for various development stacks",
    language: "YAML",
    stars: 31,
    forks: 7,
    updatedAt: "2023-12-07T16:30:00Z",
    owner: {
      login: "developer6",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export function GistTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGist, setSelectedGist] = useState(null)
  const [isGistViewerOpen, setIsGistViewerOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("all")

  // State for starred, forked, and favorite gists
  const [starredGists, setStarredGists] = useState<string[]>([])
  const [forkedGists, setForkedGists] = useState<string[]>([])
  const [favoriteGists, setFavoriteGists] = useState<string[]>([])

  // Filter gists based on search query
  const filteredGists = mockGists.filter(
    (gist) =>
      gist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gist.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter gists based on active tab
  const displayedGists = () => {
    switch (activeTab) {
      case "starred":
        return filteredGists.filter((gist) => starredGists.includes(gist.id))
      case "forked":
        return filteredGists.filter((gist) => forkedGists.includes(gist.id))
      case "favorites":
        return filteredGists.filter((gist) => favoriteGists.includes(gist.id))
      default:
        return filteredGists
    }
  }

  const openGistViewer = (gist) => {
    setSelectedGist(gist)
    setIsGistViewerOpen(true)
  }

  const closeGistViewer = () => {
    setIsGistViewerOpen(false)
  }

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleLogin = (credentials) => {
    // Mock login functionality
    console.log("Login with:", credentials)
    setIsLoggedIn(true)
    setUser({
      username: credentials.username,
      avatar: "/placeholder.svg?height=40&width=40",
    })
    closeLoginModal()
    toast.success(`Welcome back, ${credentials.username}!`, {
      description: "You have successfully logged in.",
    })
  }

  const handleGithubLogin = () => {
    // Mock GitHub OAuth login
    console.log("GitHub OAuth login")
    setIsLoggedIn(true)
    setUser({
      username: "github-user",
      avatar: "/placeholder.svg?height=40&width=40",
    })
    closeLoginModal()
    toast.success("Logged in with GitHub", {
      description: "You have successfully logged in with GitHub.",
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    toast.info("Logged out", {
      description: "You have been logged out successfully.",
    })
  }

  const toggleStar = (e, gistId) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    setStarredGists((prev) => {
      if (prev.includes(gistId)) {
        toast.info("Unstarred", {
          description: "Gist has been removed from your starred list.",
        })
        return prev.filter((id) => id !== gistId)
      } else {
        toast.success("Starred", {
          description: "Gist has been added to your starred list.",
        })
        return [...prev, gistId]
      }
    })
  }

  const toggleFork = (e, gistId) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    if (!forkedGists.includes(gistId)) {
      setForkedGists((prev) => [...prev, gistId])
      toast.success("Forked", {
        description: "Gist has been forked to your account.",
      })
    } else {
      toast.info("Already Forked", {
        description: "You've already forked this gist.",
      })
    }
  }

  const toggleFavorite = (e, gistId) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    setFavoriteGists((prev) => {
      if (prev.includes(gistId)) {
        toast.info("Removed from favorites", {
          description: "Gist has been removed from your favorites.",
        })
        return prev.filter((id) => id !== gistId)
      } else {
        toast.success("Added to favorites", {
          description: "Gist has been added to your favorites.",
        })
        return [...prev, gistId]
      }
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="grid gap-4 py-4">
                  <Button variant="ghost" className="justify-start gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => setActiveTab("starred")}>
                    <Star className="h-4 w-4" />
                    Starred
                    {starredGists.length > 0 && (
                      <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                        {starredGists.length}
                      </span>
                    )}
                  </Button>
                  <Button variant="ghost" className="justify-start gap-2" onClick={() => setActiveTab("favorites")}>
                    <Heart className="h-4 w-4" />
                    Favorites
                    {favoriteGists.length > 0 && (
                      <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                        {favoriteGists.length}
                      </span>
                    )}
                  </Button>
                  <Button variant="ghost" className="justify-start gap-2">
                    <BookOpen className="h-4 w-4" />
                    Documentation
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <Github className="h-6 w-6" />
              <h1 className="text-xl font-bold">Gist Tracker</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:flex w-full max-w-sm items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search gists..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ThemeToggle />
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <img
                      src={user?.avatar || "/placeholder.svg?height=32&width=32"}
                      alt={user?.username || "User"}
                      className="rounded-full w-8 h-8 border"
                    />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">Signed in as {user?.username}</DropdownMenuItem>
                  <DropdownMenuItem>Your Profile</DropdownMenuItem>
                  <DropdownMenuItem>Your Gists</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" className="hidden md:flex" onClick={openLoginModal}>
                <Github className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      <div className="container px-4 py-6 flex-1">
        <div className="md:hidden mb-4">
          <div className="relative flex w-full items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search gists..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="hidden md:flex flex-col w-[240px] gap-4">
            <nav className="grid gap-2">
              <Button variant="ghost" className="justify-start gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button
                variant={activeTab === "starred" ? "secondary" : "ghost"}
                className="justify-start gap-2"
                onClick={() => setActiveTab("starred")}
              >
                <Star className="h-4 w-4" />
                Starred
                {starredGists.length > 0 && (
                  <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    {starredGists.length}
                  </span>
                )}
              </Button>
              <Button
                variant={activeTab === "favorites" ? "secondary" : "ghost"}
                className="justify-start gap-2"
                onClick={() => setActiveTab("favorites")}
              >
                <Heart className="h-4 w-4" />
                Favorites
                {favoriteGists.length > 0 && (
                  <span className="ml-auto bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                    {favoriteGists.length}
                  </span>
                )}
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Documentation
              </Button>
            </nav>
          </aside>
          <main className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList className="bg-card border">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    All Gists
                  </TabsTrigger>
                  <TabsTrigger
                    value="starred"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Starred
                  </TabsTrigger>
                  <TabsTrigger
                    value="forked"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Forked
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Favorites
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!isLoggedIn) {
                      openLoginModal()
                      return
                    }
                    toast("Create Gist", {
                      description: "This feature is coming soon!",
                    })
                  }}
                >
                  <Code className="mr-2 h-4 w-4" />
                  New Gist
                </Button>
              </div>
              <TabsContent value="all" className="space-y-4">
                {displayedGists().length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayedGists().map((gist) => (
                      <GistCard
                        key={gist.id}
                        gist={gist}
                        onView={() => openGistViewer(gist)}
                        isStarred={starredGists.includes(gist.id)}
                        isForked={forkedGists.includes(gist.id)}
                        isFavorite={favoriteGists.includes(gist.id)}
                        onToggleStar={(e) => toggleStar(e, gist.id)}
                        onToggleFork={(e) => toggleFork(e, gist.id)}
                        onToggleFavorite={(e) => toggleFavorite(e, gist.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No gists found matching your search.</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="starred" className="space-y-4">
                {displayedGists().length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayedGists().map((gist) => (
                      <GistCard
                        key={gist.id}
                        gist={gist}
                        onView={() => openGistViewer(gist)}
                        isStarred={starredGists.includes(gist.id)}
                        isForked={forkedGists.includes(gist.id)}
                        isFavorite={favoriteGists.includes(gist.id)}
                        onToggleStar={(e) => toggleStar(e, gist.id)}
                        onToggleFork={(e) => toggleFork(e, gist.id)}
                        onToggleFavorite={(e) => toggleFavorite(e, gist.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No starred gists yet.</p>
                    {isLoggedIn ? (
                      <p className="text-sm text-muted-foreground mt-2">Star gists to save them for later.</p>
                    ) : (
                      <Button variant="outline" className="mt-4" onClick={openLoginModal}>
                        <Github className="mr-2 h-4 w-4" />
                        Sign in to star gists
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="forked" className="space-y-4">
                {displayedGists().length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayedGists().map((gist) => (
                      <GistCard
                        key={gist.id}
                        gist={gist}
                        onView={() => openGistViewer(gist)}
                        isStarred={starredGists.includes(gist.id)}
                        isForked={forkedGists.includes(gist.id)}
                        isFavorite={favoriteGists.includes(gist.id)}
                        onToggleStar={(e) => toggleStar(e, gist.id)}
                        onToggleFork={(e) => toggleFork(e, gist.id)}
                        onToggleFavorite={(e) => toggleFavorite(e, gist.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No forked gists yet.</p>
                    {isLoggedIn ? (
                      <p className="text-sm text-muted-foreground mt-2">Fork gists to create your own copy.</p>
                    ) : (
                      <Button variant="outline" className="mt-4" onClick={openLoginModal}>
                        <Github className="mr-2 h-4 w-4" />
                        Sign in to fork gists
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="favorites" className="space-y-4">
                {displayedGists().length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayedGists().map((gist) => (
                      <GistCard
                        key={gist.id}
                        gist={gist}
                        onView={() => openGistViewer(gist)}
                        isStarred={starredGists.includes(gist.id)}
                        isForked={forkedGists.includes(gist.id)}
                        isFavorite={favoriteGists.includes(gist.id)}
                        onToggleStar={(e) => toggleStar(e, gist.id)}
                        onToggleFork={(e) => toggleFork(e, gist.id)}
                        onToggleFavorite={(e) => toggleFavorite(e, gist.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">No favorite gists yet.</p>
                    {isLoggedIn ? (
                      <p className="text-sm text-muted-foreground mt-2">
                        Add gists to your favorites for quick access.
                      </p>
                    ) : (
                      <Button variant="outline" className="mt-4" onClick={openLoginModal}>
                        <Github className="mr-2 h-4 w-4" />
                        Sign in to add favorites
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      <footer className="border-t py-4 bg-background">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GitHub Gist Tracker.
        </div>
      </footer>

      {/* Gist Viewer Modal */}
      <GistViewer isOpen={isGistViewerOpen} onClose={closeGistViewer} gist={selectedGist} />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLogin={handleLogin}
        onGithubLogin={handleGithubLogin}
      />

      {/* Sonner Toast Provider */}
      <SonnerProvider />
    </div>
  )
}

function GistCard({ gist, onView, isStarred, isForked, isFavorite, onToggleStar, onToggleFork, onToggleFavorite }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border-border bg-card"
      onClick={onView}
    >
      <CardHeader className="pb-3 bg-card">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <img
              src={gist.owner.avatar || "/placeholder.svg"}
              alt={gist.owner.login}
              className="rounded-full w-6 h-6"
            />
            <span className="text-sm font-medium text-card-foreground">{gist.owner.login}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isFavorite ? "text-red-500" : "text-card-foreground"}`}
              onClick={onToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onView()
                  }}
                >
                  View Gist
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleStar(e)
                  }}
                >
                  {isStarred ? "Unstar Gist" : "Star Gist"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFork(e)
                  }}
                >
                  {isForked ? "Already Forked" : "Fork Gist"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Download</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <CardTitle className="text-base font-medium mt-2 text-card-foreground">{gist.name}</CardTitle>
        <CardDescription className="line-clamp-2 text-card-foreground/70">{gist.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{gist.language}</span>
          {isForked && <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">Forked</span>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground pt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 p-0 ${isStarred ? "text-yellow-500" : "text-card-foreground/70"}`}
              onClick={onToggleStar}
            >
              <Star className={`h-3 w-3 ${isStarred ? "fill-current" : ""}`} />
            </Button>
            {gist.stars}
          </div>
          <div className="flex items-center gap-1">
            <Github className="h-3 w-3" />
            {gist.forks}
          </div>
        </div>
        <div>Updated {formatDate(gist.updatedAt)}</div>
      </CardFooter>
    </Card>
  )
}

