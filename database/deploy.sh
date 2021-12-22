docker build --platform linux/amd64 ./database -t benarmstrong/eth_rooms_db:latest
docker push benarmstrong/eth_rooms_db:latest
ssh ben-docker-1 "cd eth_rooms; docker-compose pull; docker-compose up -d"