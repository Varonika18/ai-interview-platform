from fastapi import APIRouter
from app.services.answer_evaluator import evaluate_answer
from app.services.question_generator import generate_questions, get_solution_for_question

router = APIRouter()


@router.post("/evaluate-answer")
def evaluate(data: dict):
    question = data.get("question", "")
    user_answer = data.get("answer", "")
    result = evaluate_answer(question, user_answer)
    return result


@router.get("/questions")
def get_questions(subject: str, difficulty: str, count: int = 5):
    questions = generate_questions(subject, difficulty, count)
    return {"questions": questions}


@router.get("/solution")
def get_solution(question: str):
    return {"solution": get_solution_for_question(question)}
