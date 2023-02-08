FROM emscripten/emsdk:3.1.26

# install yarn
RUN npm install -g yarn

# move source files into /src and yarn install
COPY package.json /src
COPY yarn.lock /src
RUN yarn install --production --frozen-lockfile
COPY . /src

# set production node environment
ENV NODE_ENV=production
