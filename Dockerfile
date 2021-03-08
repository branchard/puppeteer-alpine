# Ligntweigt node, npm and chromium container
FROM alpine:3.13

# Installing deps
# tini seems to avoid chromium zombie processes
RUN apk add --no-cache shadow sudo tini

# Creating the app user and allow it to run sudo command without asking password
RUN addgroup app && adduser --disabled-password --ingroup app app wheel && \
    echo "app ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/app && chmod 0440 /etc/sudoers.d/app && \
    chmod 777 -R /home/app

# Installing node and npm
RUN apk add --no-cache nodejs npm

# Installing chromium
RUN apk add --no-cache \
    libstdc++ \
    chromium \
    harfbuzz \
    nss \
    freetype \
    ttf-freefont

# Smoke tests
RUN node --version && npm --version && chromium-browser --version

# Copying the sources
COPY --chown=app:app ./app /app

USER app
WORKDIR /app

# Installing node modules
RUN npm i --only=prod

# Cleaning the container
USER root
RUN rm -rf /var/cache/* && mkdir /var/cache/apk && rm -rf /home/app/.npm

USER app

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "index.js"]