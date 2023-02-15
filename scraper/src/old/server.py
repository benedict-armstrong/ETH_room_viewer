from flask import Flask, make_response, jsonify, request, abort
from flask_cors import CORS
from dao import get_all_rooms, get_all_rooms_no_time, get_all_rooms_filters
from datetime import datetime, timedelta

app = Flask(__name__)

CORS(app)


@app.errorhandler(404)
def not_found(e):
    return make_response(jsonify({'error': 'Not found'}), 404)


@app.route("/api/v1/rooms/", methods=["GET"])
def get_rooms():
    """
    Get all rooms
    """
    building = request.args.get('building')
    start = request.args.get('start')
    end = request.args.get('end')
    room_type = request.args.get('room_type')
    area = request.args.get('area')
    capacity = request.args.get('capacity')
    floor = request.args.get('floor')
    if start and end:
        try:
            start = datetime.strptime(start, '%d_%m_%y_%H')
            end = datetime.strptime(end, '%d_%m_%y_%H')
            return jsonify(get_all_rooms_filters(building, start, end, room_type, area, capacity, floor))
        except:
            return make_response("Bad request", 400)
    else:
        return jsonify(get_all_rooms_no_time(building, room_type, area, capacity, floor))


# @app.route("/api/v1/rooms/", methods=["GET"])
# def get_free_now():
#     building = request.args.get('building')
#     start = request.args.get('start')
#     end = request.args.get('end')
#     room_type = request.args.get('room_type')
#     if start and end and building:
#         try:
#             start = datetime.strptime(start, '%d_%m_%y_%H')
#             end = datetime.strptime(end, '%d_%m_%y_%H')
#             if room_type:
#                 return jsonify(get_rooms_by_datetime_and_free_until_and_building_and_roomtype(start, end, building, room_type))
#             else:
#                 return jsonify(get_rooms_by_datetime_and_free_until_and_building(start, end, building))
#         except:
#             return make_response("Bad request", 400)
#     if building:
#         return jsonify(get_free_rooms_by_datetime_and_building(datetime.now(), building))
#     else:
#         return jsonify(get_free_rooms_by_datetime(datetime.now()))


@app.route("/api/v1/rooms/all", methods=["GET"])
def all_rooms():
    return jsonify(get_all_rooms())


@app.route("/api/healthcheck", methods=["GET"])
def ping():
    return "OK"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
