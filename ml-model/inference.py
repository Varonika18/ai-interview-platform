from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def evaluate(user_answer, correct_answer):

    emb1 = model.encode(user_answer)
    emb2 = model.encode(correct_answer)

    score = util.cos_sim(emb1, emb2)

    return float(score)