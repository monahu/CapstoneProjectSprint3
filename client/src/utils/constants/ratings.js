import { ThumbsUp, Frown, CircleHelp, Heart } from 'lucide-react'

export const ICON_MAP = {
  ThumbsUp,
  Frown,
  CircleHelp,
  Heart,
}

export const RATING_MAP = {
  RECOMMENDED: {
    color: 'bg-secondary',
    text: 'Recommended',
    icon: ['ThumbsUp', '😁'],
  },
  SOSO: {
    color: 'bg-accent-content',
    text: 'Not Recommended',
    icon: ['CircleHelp', '🙁'],
  },
  NEW: {
    color: 'bg-primary/50',
    text: 'New',
    icon: ['🆕', '🤔'],
  },
}
