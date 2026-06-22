import os
import json
import csv
import io
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_dataset(description: str, num_rows: int, columns: list):
    prompt = f"""Tu es un générateur de données synthétiques pour le Machine Learning.

Contexte du dataset: {description}
Nombre de lignes à générer: {num_rows}
Colonnes attendues: {json.dumps(columns, ensure_ascii=False)}

Génère exactement {num_rows} lignes de données réalistes et statistiquement cohérentes
(corrélations logiques entre colonnes, distribution réaliste, pas de données aléatoires absurdes).

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans markdown.
Format: [{{"col1": val1, "col2": val2}}, ...]
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4096,
    )

    text = response.choices[0].message.content.strip()
    text = text.replace("```json", "").replace("```", "").strip()

    data = json.loads(text)
    return data


def to_csv(data: list) -> str:
    if not data:
        return ""

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    return output.getvalue()