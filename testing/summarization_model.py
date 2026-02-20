from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

review = "The phone performance is excellent and the display looks great, \
but the battery drains quickly and camera quality is average."

summary = summarizer(
    review,
    max_length=40,
    min_length=15,
    do_sample=False
)

print(summary[0]["summary_text"])
