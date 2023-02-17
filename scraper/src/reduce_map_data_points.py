from typing import List, Tuple
from dao import get_all_map_data, update_map_data_points


def remove_points(points: List[Tuple[int]]):
    new_points = []
    for i, p in enumerate(points):
        if i == 0:
            new_points.append(p)
            continue
        if i == len(points) - 1:
            new_points.append(p)
            continue
        if p[0] == points[i - 1][0] == points[i + 1][0]:
            continue
        if p[1] == points[i - 1][1] == points[i + 1][1]:
            continue
        new_points.append(p)
    return new_points


def reduce_map_data_points():
    map_data = get_all_map_data()

    # DEBUG: only keep the first map data
    # map_data = [map_data[0]]

    count = len(map_data)

    for data in map_data:
        print("Remaining: ", count)

        # print(data.points)
        print(data.room_id)

        points = [p for p in data.points.split(' ')]
        points = [tuple(int(p) for p in p.split(',')) for p in points]

        # iterate over points, if three consecutive points match in one axis, remove the middle point
        # repeat until no more points can be removed
        points = remove_points(points)
        while True and len(points) > 2:
            temp = remove_points(points)
            if len(points) == len(temp):
                break
            points = temp

        data.points = ' '.join([f'{p[0]},{p[1]}' for p in points])
        count -= 1

    for data in map_data:
        update_map_data_points(data.points, data.room_id)

    print("Done! :)")

    return


if __name__ == '__main__':
    reduce_map_data_points()
