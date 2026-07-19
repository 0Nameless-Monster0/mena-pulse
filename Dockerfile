# Free 24/7 backend on Hugging Face Spaces (Docker Space) or Google Cloud Run.
# HF Spaces expects the app on port 7860.
FROM mcr.microsoft.com/playwright/python:v1.44.0-jammy
WORKDIR /code
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .
EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
