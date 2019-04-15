FROM debian:stable-slim

RUN ls
RUN apt-get update

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
