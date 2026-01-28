FROM emscripten/emsdk:3.1.74

# enable corepack for Yarn 4.x
RUN corepack enable

# move source files into /src and yarn install
WORKDIR /src
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY . .

# set production node environment
ENV NODE_ENV=production
