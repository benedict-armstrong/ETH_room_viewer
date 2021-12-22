ng build #--configuration="production"
docker build --platform linux/amd64 . -t benarmstrong/eth_rooms_client:latest
docker push benarmstrong/eth_rooms_client:latest
ssh ben-docker-1 "cd eth_rooms; docker-compose pull; docker-compose up -d"
