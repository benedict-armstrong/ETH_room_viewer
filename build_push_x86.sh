docker build ./app -t benarmstrong/eth_rooms_client --platform linux/amd64
docker build ./database -t benarmstrong/eth_rooms_database --platform linux/amd64

docker push benarmstrong/eth_rooms_client
docker push benarmstrong/eth_rooms_database
