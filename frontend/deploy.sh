docker build --platform linux/amd64 . -t benarmstrong/eth_rooms_frontend:latest
docker push benarmstrong/eth_rooms_frontend:latest
ssh ben-docker-1 "cd eth_rooms; docker-compose pull; docker-compose up -d"