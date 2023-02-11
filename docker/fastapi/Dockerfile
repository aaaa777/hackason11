FROM python:3-buster

COPY ./requirements.txt /app/

RUN apt update \
 && apt install net-tools \
 && mkdir -p /app/files && cd /app \
 && pip install -r requirements.txt 

COPY ./main.py /app/

ENTRYPOINT [ "python3", "main.py" ]