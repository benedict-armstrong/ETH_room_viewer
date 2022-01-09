npm run build
docker build --platform linux/amd64 . -t benarmstrong/eth_rooms_api:latest
docker push benarmstrong/eth_rooms_api:latest
ssh ben-docker-1 "cd eth_rooms; docker-compose pull eth_rooms_api; docker-compose up -d"