import pandas as pd
import pickle
from sentence_transformers import SentenceTransformer

# load dataset
data = pd.read_csv("dataset/interview_qa.csv")

questions = data["question"].tolist()
answers = data["answer"].tolist()

# load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

print("Generating embeddings...")

embeddings = model.encode(answers)

# save embeddings
model_data = {
    "questions": questions,
    "answers": answers,
    "embeddings": embeddings
}

with open("model/answer_model.pkl", "wb") as f:
    pickle.dump(model_data, f)

print("Model saved successfully!")