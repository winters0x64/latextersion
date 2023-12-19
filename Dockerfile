FROM python:3.9-slim

RUN apt update && apt install -y texlive-latex-recommended

WORKDIR /app

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3000

ENV FLASK_ENV=production
ENV FLASK_APP=app.py

CMD ["python3", "app.py"]
