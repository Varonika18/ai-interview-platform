from fastapi import APIRouter
from app.services.answer_evaluator import evaluate_answer

router = APIRouter()

@router.post("/evaluate-answer")
def evaluate(data: dict):

    user_answer = data["answer"]

    score = evaluate_answer(user_answer)

    return {
        "score": score
    }