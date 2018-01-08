FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y \
    wget \
    curl
RUN cd /tmp \
    && wget https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.gz \
    && cd /usr/local \
    && tar --strip-components 1 -xzf /tmp/node-v6.9.1-linux-x64.tar.gz

RUN apt-get install -y \
    git
WORKDIR /
RUN git clone git://github.com/c9/core.git cloud9
RUN apt-get install -y \
    build-essential tmux bash g++ make curl python
# RUN apk --update add build-base g++ make curl wget openssl-dev apache2-utils git libxml2-dev sshfs bash tmux
RUN curl -s -L https://raw.githubusercontent.com/c9/install/master/link.sh | bash \
    && /cloud9/scripts/install-sdk.sh \
    && sed -i -e 's_127.0.0.1_0.0.0.0_g' /cloud9/configs/standalone.js \
    && mkdir /workspace
RUN npm i -g nodemon yarn grunt-cli gulp-cli
ENV TERM=xterm-256color
COPY launcher /opt/launcher
WORKDIR /opt/launcher
RUN npm i
COPY user.settings /root/.c9/user.settings

RUN cd /tmp \
    && wget https://nodejs.org/dist/v8.9.3/node-v8.9.3-linux-x64.tar.gz \
    && cd /usr/local \
    && tar --strip-components 1 -xzf /tmp/node-v8.9.3-linux-x64.tar.gz

RUN npm i -g grunt-cli gulp-cli nodemon

ENTRYPOINT ["node", "/opt/launcher/run.js"]
EXPOSE 80
