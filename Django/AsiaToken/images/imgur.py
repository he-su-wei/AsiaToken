
# from imgurpython import ImgurClient

# client_id = '44c92709ec667f4'
# client_secret = '89c0d3d5a269db3adc9b3d28c19d3a8ba85f3d46'

# client = ImgurClient(client_id, client_secret)


# print(client.get_account_image_ids(109201372, page=0))

#  add image to imgur
import pyimgur
from PIL import Image

def uploadImg(img,uid):
    CLIENT_ID = "44c92709ec667f4"
    img.save('AsiaToken/images/{}.png'.format(uid))
    PATH = 'AsiaToken/images/{}.png'.format(uid) #A Filepath to an image on your computer"
    title = 'AsisToken-{}'.format(uid)

    im = pyimgur.Imgur(CLIENT_ID)
    # delete_image = delete_image(image_id)
    uploaded_image = im.upload_image(PATH, title=title)
    print(uploaded_image.title)
    print(uploaded_image.link)
    print(uploaded_image.type)
    return uploaded_image.link

