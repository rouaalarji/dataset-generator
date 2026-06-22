from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import io

from dataset_generator import generate_dataset, to_csv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Column(BaseModel):
    name: str
    type: str
    range: str | None = None
    values: list[str] | None = None

class DatasetRequest(BaseModel):
    description: str
    num_rows: int
    columns: list[Column]

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/generate")
def generate(request: DatasetRequest):
    if request.num_rows > 100:
        raise HTTPException(status_code=400, detail="Max 100 lignes pendant les tests (limite Groq free tier)")

    columns_dict = [c.dict() for c in request.columns]
    data = generate_dataset(request.description, request.num_rows, columns_dict)
    csv_content = to_csv(data)

    return StreamingResponse(
        io.StringIO(csv_content),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=dataset.csv"}
    )