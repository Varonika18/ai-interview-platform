import pickle
import os
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

# build absolute path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "ml-model", "model", "answer_model.pkl")

with open(MODEL_PATH, "rb") as f:
    data = pickle.load(f)

answers = data["answers"]
embeddings = data["embeddings"]


def evaluate_answer(user_answer):

    user_embedding = model.encode(user_answer)

    scores = util.cos_sim(user_embedding, embeddings)

    best_score = max(scores[0])

    return float(best_score)