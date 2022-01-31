import os
from PIL import Image
import numpy as np

# for image in folder /images
# crop image to size of image and remove background
# save cropped image to folder /floorplans
# save room mask data to file in /room_masks

# iterate over all files in directory /images
for filename in os.listdir('./images/raw'):
    if filename.endswith('.gif'):
        # load the image
        with Image.open('./images/raw/' + filename) as image:
            data = np.array(image.convert("RGBA"))
            # summarize shape
            # print(data.shape)

            # remove file ending
            filename = '.'.join(filename.split('.')[:-1])

            # floorplan for each level of building
            floorplan_filename = "_".join(filename.split("_")[:-1])

            # get coordinates of all non white pixels
            color_x, color_y = np.where(np.any(data < 255, axis=2))

            # Crop image to bounding Box of Plan
            x0 = color_x.min()
            x1 = color_x.max()
            y0 = color_y.min()
            y1 = color_y.max()
            cropped_image = data[x0:x1 + 1, y0:y1 + 1]

            # h, w of cropped image
            h, w, _ = cropped_image.shape

            # create mask for all white pixels
            white_pixels_mask = np.all(
                cropped_image == [255, 255, 255, 255], axis=-1)

            # create mask of room
            room_mask = np.all(
                cropped_image == [0, 255, 255, 255], axis=-1)

            # apply masks to plan (removing room and white background -> transparent)
            cropped_image[room_mask] = [255, 255, 255, 0]
            cropped_image[white_pixels_mask] = [255, 255, 255, 0]

            points = []

            # iterate over all rows of room_mask
            for i in range(h):
                # iterate over all columns of room_mask
                for j in range(w):
                    # if pixel is colored
                    if room_mask[i, j] != 0:
                        # append point to list
                        points.append((j, i))
                        break

            for i in reversed(range(h)):
                for j in reversed(range(w)):
                    # if pixel is colored
                    if room_mask[i, j] != 0:
                        # append point to list
                        points.append((j, i))
                        break

            # Save as SVG
            # create SVG file
            # dwg = svgwrite.Drawing('./images/room_masks/' +
            #                        filename + "_mask.svg", size=(w, h), profile='tiny')

            # polygon = dwg.add(dwg.g(id='polygon', fill='green'))
            # polygon.add(dwg.polygon(points=points,
            #             fill='green', stroke='black'))
            # dwg.save()

            with open('./images/room_masks/' + filename + "_mask", 'w') as f:
                f.write(str(w) + " " + str(h) + '\n')
                for x, y in points:
                    f.write(str(x) + "," + str(y) + " ")

            # Stack arrays in 3rd dimension so that mask is an image (RGBA)
            # room_mask = np.dstack((room_mask, np.zeros(
            #    room_mask.shape), np.zeros(room_mask.shape), np.full(room_mask.shape, fill_value=255)))

            # create mask of all black pixels in room_mask
            # black_pixels_mask = np.all(room_mask == [0, 0, 0, 255], axis=-1)

            # make everything but the actual room transparent
            # room_mask[black_pixels_mask] = [255, 255, 255, 0]

            # changes datatype for entries to unit8 (from float)
            # room_mask = room_mask.astype(np.uint8)

            # print(np.info(cropped_image))
            # print(np.info(room_mask))

            # Arrays to Images
            # mask = Image.fromarray(room_mask)
            image = Image.fromarray(cropped_image)

            if not os.path.isfile('./images/floorplans/' + floorplan_filename + ".webp"):
                # Save cropped and transparent plan
                image.save('./images/floorplans/' +
                           floorplan_filename + ".webp", 'WebP')

            # # Save mask for room
            # mask.save('./images/room_masks/' +
            #           filename + "_mask.svg", 'SVG')
