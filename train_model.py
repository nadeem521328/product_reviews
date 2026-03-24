import os
os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'
os.environ['HF_TOKEN'] = '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'
os.environ["HF_HUB_OFFLINE"] = "0"  # Need online for push

from transformers import (
    AutoTokenizer, 
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer
)
from datasets import Dataset
import torch
import evaluate

# Labels map
id2label = {0: 'negative', 1: 'neutral', 2: 'positive'}
label2id = {'negative': 0, 'neutral': 1, 'positive': 2}

# All training data (12 labeled reviews)
train_data = [
    # Orig 3
    {'text': 'Your first review from reviews.txt', 'label': 2},  # pos
    {'text': 'Your second review', 'label': 2},  # pos
    {'text': 'Your third review', 'label': 0},  # neg
    
    # Task 9
    {'text': 'The product performs quite well overall, although there are a few minor issues that could be improved.', 'label': 2},
    {'text': 'I liked the design and usability, but the performance occasionally feels inconsistent.', 'label': 2},
    {'text': 'It delivers good results most of the time, even though it doesn’t always meet expectations.', 'label': 2},
    {'text': 'The product is neither impressive nor disappointing. It works, but nothing really stands out.', 'label': 1},
    {'text': 'It does what it is supposed to do, though the experience feels somewhat underwhelming.', 'label': 1},
    {'text': 'Performance is acceptable, but there is a noticeable lack of refinement in some areas.', 'label': 1},
    {'text': 'At first it seemed promising, but over time several issues started to appear.', 'label': 0},
    {'text': 'The product might work for basic use, but it struggles with more demanding tasks.', 'label': 0},
    {'text': 'While it has a few good aspects, the overall experience ends up being frustrating.', 'label': 0},
]

# Load model/tokenizer
model_name = 'cardiffnlp/twitter-roberta-base-sentiment-latest'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, 
    num_labels=3, 
    id2label=id2label, 
    label2id=label2id
)

def tokenize(examples):
    return tokenizer(examples['text'], truncation=True, padding=True, max_length=128)

dataset = Dataset.from_list(train_data)
dataset = dataset.map(tokenize, batched=True)
dataset = dataset.rename_column('label', 'labels')
dataset.set_format('torch')

# Metrics
metric = evaluate.load('accuracy')
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = torch.argmax(torch.tensor(logits), dim=-1)
    return metric.compute(predictions=predictions, references=labels)

# Train
training_args = TrainingArguments(
    output_dir='./fine_tuned_sentiment',
    num_train_epochs=5,
    per_device_train_batch_size=4,
    save_steps=50,
    logging_steps=10,
    learning_rate=2e-5,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    tokenizer=tokenizer,
    compute_metrics=compute_metrics,
)

print('Training fine-tuned model...')
trainer.train()
trainer.save_model('./fine_tuned_sentiment')
tokenizer.save_pretrained('./fine_tuned_sentiment')

print('Fine-tuned model saved to ./fine_tuned_sentiment')
