from fastapi import APIRouter
from app.services.answer_evaluator import evaluate_answer
from app.services.question_generator import generate_questions

router = APIRouter()


@router.post("/evaluate-answer")
def evaluate(data: dict):
    user_answer = data["answer"]
    score = evaluate_answer(user_answer)
    return {"score": score}


@router.get("/questions")
def get_questions(subject: str, difficulty: str):
    questions = generate_questions(subject, difficulty)
    return {"questions": questions}
