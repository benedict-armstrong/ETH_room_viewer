import os
from dao import get_room_id_by_name, insert_map_data

# iterate over all files in directory /images
for filename in os.listdir('./floorplans/images/room_masks'):
    if filename.endswith('mask'):
        # open file
        with open('./floorplans/images/room_masks/' + filename, 'r') as f:
            w, h = f.readline().split(" ")
            points = f.readline()
            id = get_room_id_by_name(
                " ".join(filename.split('_')[2:5]))["id"]
            insert_map_data(w, h, points, id)
