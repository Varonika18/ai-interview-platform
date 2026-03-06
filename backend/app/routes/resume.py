from fastapi import APIRouter, UploadFile
import PyPDF2

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(file: UploadFile):

    pdf = PyPDF2.PdfReader(file.file)

    text = ""

    for page in pdf.pages:
        text += page.extract_text()

    return {"resume_text": text[:500]}