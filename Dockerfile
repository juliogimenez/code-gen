FROM ubuntu:latest
LABEL authors="visio"

ENTRYPOINT ["top", "-b"]
