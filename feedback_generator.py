import os
os.environ["HF_HUB_DISABLE_PROGRESS_BARS"] = "1"

from transformers import pipeline, logging

logging.set_verbosity_error()

class FeedbackGenerator:
    def __init__(self):
        # Initialize DistilGPT-2 for text generation
        self.generator = pipeline(
            "text-generation",
            model="distilgpt2",
            max_length=150,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            truncation=True
        )
    
    def generate_feedback(self, summary_data, sample_reviews=None):
        """
        Generate natural language feedback based on review summary.
        
        Args:
            summary_data: dict with 'total_reviews', 'positive', 'neutral', 'negative'
            sample_reviews: list of review texts (optional, for context)
        
        Returns:
            str: Generated feedback summary
        """
        total = summary_data.get('total_reviews', 0)
        positive = summary_data.get('positive', 0)
        neutral = summary_data.get('neutral', 0)
        negative = summary_data.get('negative', 0)
        
        # Debug print
        print(f"DEBUG - Summary data: total={total}, pos={positive}, neu={neutral}, neg={negative}")
        
        # Always use template for reliability
        return self._generate_template_feedback(positive, neutral, negative, total)

    
    def _create_prompt(self, total, positive, neutral, negative, sample_reviews=None):
        """Create a prompt for the model."""
        # Calculate percentages
        pos_pct = (positive / total * 100) if total > 0 else 0
        neu_pct = (neutral / total * 100) if total > 0 else 0
        neg_pct = (negative / total * 100) if total > 0 else 0
        
        prompt = f"""Write a third-person summary about what customers think of this product based on review data. Use objective, analytical tone like a product analyst.

Review Data:
- Total Reviews: {total}
- Positive: {positive} ({pos_pct:.0f}%)
- Neutral: {neutral} ({neu_pct:.0f}%)
- Negative: {negative} ({neg_pct:.0f}%)

Summary (objective, third-person):"""
        
        return prompt

    
    def _extract_feedback(self, generated_text, prompt):
        """Extract the generated feedback from the model output."""
        # Remove the prompt from the generated text
        feedback = generated_text.replace(prompt, "").strip()
        
        # Clean up common artifacts - remove any first-person indicators
        feedback = feedback.split("Review Data:")[0].strip()
        feedback = feedback.split("Total Reviews:")[0].strip()
        feedback = feedback.split("Summary (objective")[0].strip()
        
        # Remove first-person phrases that indicate review-style text
        first_person_indicators = ["I ", "I've ", "I'm ", "I'", "My ", "Me ", "my "]
        for indicator in first_person_indicators:
            if feedback.startswith(indicator):
                # If it starts with first person, use template instead
                return None
        
        # Limit length and ensure proper ending
        if len(feedback) > 250:
            # Try to end at a sentence
            sentences = feedback[:250].split('.')
            if len(sentences) > 1:
                feedback = '.'.join(sentences[:-1]) + '.'
            else:
                feedback = feedback[:250] + '...'
        
        # Capitalize first letter
        if feedback:
            feedback = feedback[0].upper() + feedback[1:]
        
        # Validate it's not first-person
        lower_feedback = feedback.lower()
        if any(fp in lower_feedback[:20] for fp in ['i ', "i've", "i'm", 'my ']):
            return None
            
        return feedback if feedback else None

    
    def _generate_template_feedback(self, positive, neutral, negative, total):
        """Fallback template-based feedback - always third-person, objective."""
        if total == 0:
            return "No reviews available for analysis."
        
        pos_ratio = positive / total
        neg_ratio = negative / total
        neu_ratio = neutral / total
        
        # Build an Amazon-style objective summary
        parts = []
        
        # Overall sentiment statement
        if pos_ratio > 0.7:
            parts.append(f"Customers are highly satisfied with this product, with {positive} out of {total} reviews being positive.")
        elif pos_ratio > 0.5:
            parts.append(f"The majority of customers ({positive} out of {total}) have had positive experiences with this product.")
        elif neg_ratio > 0.5:
            parts.append(f"Customer feedback indicates concerns, with {negative} out of {total} reviews being negative.")
        elif neu_ratio > 0.5:
            parts.append(f"Most customers ({neutral} out of {total}) have expressed neutral opinions about this product.")
        else:
            parts.append(f"Customer feedback is mixed across {total} reviews.")
        
        # Sentiment breakdown
        sentiment_parts = []
        if positive > 0:
            sentiment_parts.append(f"{positive} positive")
        if neutral > 0:
            sentiment_parts.append(f"{neutral} neutral")
        if negative > 0:
            sentiment_parts.append(f"{negative} negative")
        
        if len(sentiment_parts) > 1:
            parts.append(f"The breakdown shows {', '.join(sentiment_parts)} reviews.")
        
        # Conclusion based on ratios
        if pos_ratio > 0.6 and neg_ratio < 0.2:
            parts.append("Overall, this product is well-received by customers.")
        elif neg_ratio > 0.4:
            parts.append("Potential buyers should consider the mixed feedback before purchasing.")
        elif neu_ratio > 0.5:
            parts.append("The product meets basic expectations but does not strongly impress customers.")
        
        return " ".join(parts)



# Singleton instance for reuse
_feedback_generator = None

def get_feedback_generator():
    """Get or create the feedback generator singleton."""
    global _feedback_generator
    if _feedback_generator is None:
        _feedback_generator = FeedbackGenerator()
    return _feedback_generator


def generate_customers_say(summary_data, sample_reviews=None):
    """
    Convenience function to generate 'Customers Say' feedback.
    
    Args:
        summary_data: dict with review counts
        sample_reviews: list of sample review texts
    
    Returns:
        str: Generated feedback text
    """
    generator = get_feedback_generator()
    return generator.generate_feedback(summary_data, sample_reviews)


if __name__ == "__main__":
    # Test the generator
    test_summary = {
        'total_reviews': 10,
        'positive': 6,
        'neutral': 2,
        'negative': 2
    }
    
    print("Testing Feedback Generator...")
    feedback = generate_customers_say(test_summary)
    print(f"\nGenerated Feedback:\n{feedback}")
