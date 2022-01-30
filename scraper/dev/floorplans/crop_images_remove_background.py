import os
from PIL import Image
import numpy as np


# for image in folder /images
# crop image to size of image
# save cropped image to folder /cropped_images

# iterate over all files in directory /images
for filename in os.listdir('./images/raw'):

    # load the image
    with Image.open('./images/raw/' + filename) as image:
        data = np.array(image.convert("RGBA"))
        # summarize shape
        # print(data.shape)

        # remove file ending
        filename = filename.split('.')[0]

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

        # create mask for all white pixels
        white_pixels_mask = np.all(
            cropped_image == [255, 255, 255, 255], axis=-1)

        # create mask of room
        room_mask = np.all(
            cropped_image == [0, 255, 255, 255], axis=-1)

        # apply masks to plan (removing room and white background -> transparent)
        cropped_image[room_mask] = [255, 255, 255, 0]
        cropped_image[white_pixels_mask] = [255, 255, 255, 0]

        # Stack arrays in 3rd dimension so that mask is an image (RGBA)
        room_mask = np.dstack((room_mask, np.zeros(
            room_mask.shape), np.zeros(room_mask.shape), np.full(room_mask.shape, fill_value=255)))

        # create mask of all black pixels in room_mask
        black_pixels_mask = np.all(room_mask == [0, 0, 0, 255], axis=-1)

        # make everything but the actual room transparent
        room_mask[black_pixels_mask] = [255, 255, 255, 0]

        # changes datatype for entries to unit8 (from float)
        room_mask = room_mask.astype(np.uint8)

        # print(np.info(cropped_image))
        # print(np.info(room_mask))

        # Arrays to Images
        mask = Image.fromarray(room_mask)
        image = Image.fromarray(cropped_image)

        if not os.path.isfile('./images/floorplans/' + floorplan_filename + ".png"):
            # Save cropped and transparent plan
            image.save('./images/floorplans/' +
                       floorplan_filename + ".png", 'PNG')

        # Save mask for room
        mask.save('./images/room_masks/' +
                  filename + "_mask.png", 'PNG')
