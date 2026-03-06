from fastapi import FastAPI
from app.routes import interview

app = FastAPI()

app.include_router(interview.router)

@app.get("/")
def home():
    return {"message": "AI Interview Platform Running"}