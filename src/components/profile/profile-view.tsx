"use client"

import Link from "next/link"
import { CalendarDays, Edit, Github, Globe, MapPin, Twitter } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ProfileView() {
  const user = {
    name: "John Doe",
    username: "johndoe",
    avatar: "/placeholder.svg?height=128&width=128",
    bio: "Software developer passionate about web technologies and open source. Building tools that make developers' lives easier.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    github: "johndoe",
    twitter: "johndoe",
    joinedDate: "January 2020",
    isCurrentUser: true,
    stats: {
      gists: 42,
      stars: 128,
      followers: 56,
      following: 23,
    },
  }

  const mockGists = [
    {
      id: "1",
      name: "React Hooks Collection",
      description: "A collection of custom React hooks for common use cases",
      language: "TypeScript",
      stars: 42,
      forks: 12,
      updatedAt: "2023-12-10T12:00:00Z",
    },
    {
      id: "2",
      name: "Next.js API Routes",
      description: "Examples of Next.js API routes with TypeScript",
      language: "TypeScript",
      stars: 28,
      forks: 5,
      updatedAt: "2023-12-05T10:30:00Z",
    },
    {
      id: "3",
      name: "CSS Grid Layouts",
      description: "Common CSS Grid layouts with examples",
      language: "CSS",
      stars: 36,
      forks: 8,
      updatedAt: "2023-12-08T09:15:00Z",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="relative pb-0">
          <div className="absolute right-4 top-4">
            {user.isCurrentUser && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/edit" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center sm:text-left">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-lg">@{user.username}</CardDescription>
              <p className="text-muted-foreground mt-2">{user.bio}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {user.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {user.github && (
              <div className="flex items-center gap-1">
                <Github className="h-4 w-4" />
                <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {user.github}
                </a>
              </div>
            )}
            {user.twitter && (
              <div className="flex items-center gap-1">
                <Twitter className="h-4 w-4" />
                <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {user.twitter}
                </a>
              </div>
            )}
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Joined {user.joinedDate}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{user.stats.gists}</div>
              <div className="text-sm text-muted-foreground">Gists</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{user.stats.stars}</div>
              <div className="text-sm text-muted-foreground">Stars</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{user.stats.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{user.stats.following}</div>
              <div className="text-sm text-muted-foreground">Following</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="gists" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="gists" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Gists</TabsTrigger>
          <TabsTrigger value="starred" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Starred</TabsTrigger>
          <TabsTrigger value="forks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Forks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gists" className="space-y-4">
          {mockGists.map((gist) => (
            <Card key={gist.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  <Link href={`/gist/${gist.id}`} className="hover:underline">
                    {gist.name}
                  </Link>
                </CardTitle>
                <CardDescription>{gist.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{gist.language}</Badge>
                  <span className="text-xs text-muted-foreground">
                    Updated on {formatDate(gist.updatedAt)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span>⭐ {gist.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🍴 {gist.forks}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="starred" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No starred gists yet.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="forks" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No forked gists yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
