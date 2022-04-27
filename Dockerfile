# 拉取要创建的新镜像的 base image（基础镜像），类似于面向对象里边的基础类
FROM node:10-jessie
# FROM node:10-buster
# FROM node:10-alpine

# 在容器内运行命令
RUN mkdir -p /app 

# 创建 docker 工作目录
WORKDIR /app
# 拷贝本地的所有文件到路径中去
COPY . /app/
# 使用 npm 安装 app 所需要的所有依赖
# RUN npm i
RUN npm i --unsafe-perm=true --allow-root --registry=https://registry.npm.taobao.org

# 暴露端口。如果程序是一个服务器，会监听一个或多个端口，可以用 EXPOSE 来表示这个端口
EXPOSE 7001

# 给容器指定一个执行入口
CMD npm run start


# docker build -t puxin/erp:0.0.1 .