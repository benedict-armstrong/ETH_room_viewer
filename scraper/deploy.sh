docker build --platform linux/amd64 . -t benarmstrong/eth_rooms_scraper:latest
docker push benarmstrong/eth_rooms_scraper:latest
ssh ben-docker-1 "docker pull benarmstrong/eth_rooms_scraper:latest"