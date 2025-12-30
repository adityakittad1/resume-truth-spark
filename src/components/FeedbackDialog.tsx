/**
 * Feedback Dialog Component
 * Allows users to submit feedback with optional rating
 * Sends feedback via email edge function
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Star, X, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackDialogProps {
  pageName: string;
  triggerClassName?: string;
}

export function FeedbackDialog({ pageName, triggerClassName }: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter your feedback message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-feedback", {
        body: {
          message: message.trim(),
          rating: rating,
          pageName: pageName,
          timestamp: new Date().toISOString(),
        },
      });

      if (error) throw error;

      setIsSuccess(true);
      
      // Show success for a moment then close
      setTimeout(() => {
        setIsOpen(false);
        setMessage("");
        setRating(null);
        setIsSuccess(false);
        
        toast({
          title: "Thank you!",
          description: "Your feedback has been sent successfully.",
        });
      }, 1500);
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Failed to send feedback",
        description: "Please try again later. We appreciate your patience.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating ?? rating;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={triggerClassName}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Share Your Feedback
          </DialogTitle>
          <DialogDescription>
            Help us improve Resumate. Your feedback is valuable!
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-success" />
              </motion.div>
              <p className="mt-4 text-lg font-medium text-foreground">
                Feedback Sent!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Rating (optional) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Rating (optional)
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(rating === star ? null : star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          displayRating && star <= displayRating
                            ? "fill-warning text-warning"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message (required) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Your Feedback <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="Tell us what you think, report issues, or suggest improvements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Metadata display */}
              <p className="text-xs text-muted-foreground">
                Sending from: {pageName}
              </p>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !message.trim()}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
