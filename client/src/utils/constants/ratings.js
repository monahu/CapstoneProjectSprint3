import { ThumbsUp, Frown, CircleHelp, Heart } from "lucide-react"

export const ICON_MAP = {
  ThumbsUp,
  Frown,
  CircleHelp,
  Heart,
}

export const RATING_MAP = {
  recommended: {
    color: "bg-secondary",
    text: "Recommended",
    icon: ["ThumbsUp", "😁"],
  },
  soso: {
    color: "bg-accent-content",
    text: "Not Recommended",
    icon: ["CircleHelp", "🙁"],
  },
  new: {
    color: "bg-primary/50",
    text: "New",
    icon: ["🆕", "🤔"],
  },
}
