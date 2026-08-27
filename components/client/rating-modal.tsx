"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star, X } from "lucide-react"

interface RatingModalProps {
  driverName: string
  onSubmit: (rating: number, comment: string) => void
  onClose: () => void
}

export function RatingModal({ driverName, onSubmit, onClose }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 safe-area-bottom animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Noter votre chauffeur</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-primary">{driverName.charAt(0)}</span>
          </div>
          <p className="font-semibold">{driverName}</p>
          <p className="text-sm text-muted-foreground">How was your ride?</p>
        </div>

        {/* Star rating */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 transition-transform hover:scale-110"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`h-10 w-10 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted stroke-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Comment */}
        <Textarea
          placeholder="Laissez un commentaire (optionnel)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mb-4 min-h-[100px]"
        />

        <Button
          onClick={() => onSubmit(rating, comment)}
          disabled={rating === 0}
          className="w-full h-12 text-lg font-semibold"
        >
          Envoyer la note
        </Button>

        <button
          type="button"
          onClick={onClose}
          className="w-full text-center text-muted-foreground mt-3 text-sm hover:underline"
        >
          Skip cette étape
        </button>
      </div>
    </div>
  )
}
