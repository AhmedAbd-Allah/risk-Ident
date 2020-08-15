# from base image
FROM node:10.15-alpine

# create app directory
RUN mkdir /app

# copy project files to directory
COPY . /app

# Enter backend dir
WORKDIR /app

# install modules 
RUN npm install

# expose port
EXPOSE 3000

# Start server
CMD npm run start
