FROM emscripten/emsdk:3.1.26

WORKDIR /src
COPY . .

# set production node environment
ENV NODE_ENV=production
