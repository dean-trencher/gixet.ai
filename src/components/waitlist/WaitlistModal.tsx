
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Check, Mail, User, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
}

const TOOL_OPTIONS = [
  "Obsidian", "Napkin AI", "Mem", "Otio", "Fabric", "mymind", "Notion", 
  "Evernote", "Craft", "Me.bot", "Raindrop", "MyMemo", "logseq", "inkdrop", 
  "Traverse", "Eraser", "MuseApp", "Milanote", "Supernotes", "others"
]

const waitlistSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  linkedin: z.string().trim().url("Invalid LinkedIn URL").max(500, "URL must be less than 500 characters"),
  currentTool: z.string().min(1, "Please select a tool"),
  reason: z.string().trim().min(10, "Please provide at least 10 characters").max(1000, "Reason must be less than 1000 characters")
});

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    linkedin: "",
    currentTool: "",
    reason: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    try {
      waitlistSchema.parse(formData);
      setErrors({});
      
      // TODO: Save to database instead of console.log
      toast.success("Thanks for joining our waitlist! We'll be in touch soon.", {
        duration: 5000,
      })
      onClose()
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        linkedin: "",
        currentTool: "",
        reason: ""
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error("Please fix the errors in the form");
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Join Our Waitlist</DialogTitle>
          <DialogDescription>
            Help us understand your needs better and get early access.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                className="pl-10"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={100}
              />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                maxLength={255}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="linkedin"
                type="url"
                className="pl-10"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                maxLength={500}
              />
            </div>
            {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="currentTool">Current Tool</Label>
            <select
              id="currentTool"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.currentTool}
              onChange={(e) => setFormData({ ...formData, currentTool: e.target.value })}
            >
              <option value="">Select a tool</option>
              {TOOL_OPTIONS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
            {errors.currentTool && <p className="text-sm text-destructive">{errors.currentTool}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Why are you interested?</Label>
            <textarea
              id="reason"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              maxLength={1000}
            />
            {errors.reason && <p className="text-sm text-destructive">{errors.reason}</p>}
          </div>

          <Button type="submit" className="w-full">
            <Check className="mr-2 h-4 w-4" /> Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
