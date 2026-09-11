FROM python:3.10-slim
WORKDIR /app
COPY ./services/recommendation-service/requirements.txt .
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt
COPY ./services/recommendation-service .
EXPOSE 5004
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5004", "--reload"]
