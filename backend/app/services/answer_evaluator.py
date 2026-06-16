import os
import re
import pickle
from sentence_transformers import SentenceTransformer, util

_model = SentenceTransformer("all-MiniLM-L6-v2")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, "ml-model", "model", "answer_model.pkl")

with open(MODEL_PATH, "rb") as f:
    _data = pickle.load(f)

_ref_answers: list = _data["answers"]
_ref_embeddings = _data["embeddings"]

_STOP = {
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "and", "or", "but", "in",
    "on", "at", "to", "for", "of", "with", "by", "from", "about", "into",
    "that", "this", "it", "its", "what", "which", "how", "when", "where",
    "not", "no", "than", "such", "as", "also", "used", "just", "like",
    "more", "so", "if", "then", "each", "they", "we", "you", "he", "she",
    "his", "her", "their", "our", "your", "there", "some", "use", "using",
}


def _keywords(text: str) -> set:
    words = re.findall(r"\b[a-zA-Z][a-zA-Z_]+\b", text.lower())
    return {w for w in words if w not in _STOP and len(w) > 3}


def _calibrate(sim: float) -> float:
    """Map cosine similarity to a 0–10 interview score.
    all-MiniLM-L6-v2 realistically scores 0.15–0.40 for correct answers
    phrased differently, so we calibrate to that realistic range.
    sim < 0.10 → off-topic (0), sim >= 0.40 → full marks (10).
    """
    if sim < 0.10:
        return 0.0
    score = (sim - 0.10) / 0.30 * 10
    return round(min(10.0, max(0.0, score)), 1)


def get_reference_answer(question: str) -> str:
    q_emb = _model.encode(question)
    sims = util.cos_sim(q_emb, _ref_embeddings)[0]
    best_idx = int(sims.argmax())
    return _ref_answers[best_idx] if best_idx < len(_ref_answers) else "No reference answer available."


def evaluate_answer(question: str, user_answer: str) -> dict:
    if len(user_answer.strip()) < 5:
        return {
            "score": 0,
            "what_was_good": "No answer was provided.",
            "what_was_missing": "A complete explanation of the concept.",
            "how_to_improve": "Attempt an answer in your own words — even a partial one helps you learn.",
        }

    user_emb = _model.encode(user_answer)
    sims = util.cos_sim(user_emb, _ref_embeddings)[0]

    best_idx = int(sims.argmax())
    best_sim = float(sims[best_idx])
    best_ref = _ref_answers[best_idx] if best_idx < len(_ref_answers) else ""

    score = _calibrate(best_sim)

    user_kw = _keywords(user_answer)
    ref_kw = _keywords(best_ref)
    q_kw = _keywords(question)

    covered = sorted(user_kw & ref_kw)
    missing = sorted((ref_kw - user_kw) & (ref_kw | q_kw))

    def fmt(lst, n=5):
        return ", ".join(lst[:n]) if lst else None

    if score >= 8:
        good = f"Strong answer covering key concepts: {fmt(covered) or 'core ideas well explained'}."
        missing_str = f"Could also mention: {fmt(missing)}." if missing else "Very complete answer."
        improve = "Add a concrete real-world example to make your answer exceptional."
    elif score >= 6:
        good = f"Good grasp of the topic. Used relevant terms: {fmt(covered) or 'some core concepts'}."
        missing_str = f"Missing depth on: {fmt(missing) or 'some technical details'}."
        improve = "Expand with more technical detail and an example to strengthen your answer."
    elif score >= 4:
        good = f"Touched on some relevant ideas: {fmt(covered) or 'partial understanding shown'}."
        missing_str = f"Key concepts not covered: {fmt(missing) or 'most core concepts'}."
        improve = "Review the topic. Define the concept clearly, then explain how/why it works."
    elif score >= 2:
        good = "Made an attempt — some partial effort shown."
        missing_str = f"Answer lacked most key concepts. Needed: {fmt(list(q_kw)) or 'core topic coverage'}."
        improve = "Re-study the topic. Focus on: what it is, why it exists, and how it works."
    else:
        good = "Answer did not match the topic."
        missing_str = f"No relevant content detected for: {question[:80]}."
        improve = "Study this topic from scratch, then try explaining it in your own words."

    return {
        "score": score,
        "what_was_good": good,
        "what_was_missing": missing_str,
        "how_to_improve": improve,
    }
