FROM nvidia/cuda:12.1-base

RUN apt-get update && apt-get install -y python3-pip ffmpeg

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY ./src /app/src

CMD ["uvicorn", "src.backend.app:app", "--host", "0.0.0.0", "--port", "8001"]