#!/usr/bin/env python
# coding: utf-8

# In[1]:


from __future__ import print_function
import os
import numpy as np
import cv2
import os
import sys
stderr = sys.stderr
sys.stderr = open(os.devnull, 'w')
import keras
sys.stderr = stderr
import tensorflow as tf
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from keras.models import model_from_json
from keras.models import Sequential
from keras import losses
from keras.layers import Dense, Dropout, Flatten, BatchNormalization
from keras.layers import Conv2D, MaxPooling2D
from keras import backend as K
from keras.optimizers import Adam
from collections import Counter
import matplotlib.pyplot as plt
import librosa
import librosa.display
# import os
from os.path import isfile
import shutil
import gc
import warnings 
import numpy as np
# import sys
warnings.filterwarnings("ignore")


# In[2]:


def get_length(path):
    y, sr  = librosa.load(path)
    length = librosa.get_duration(y=y, sr=sr)
    gc.collect()
    return length


# In[3]:


def save_wav(data_path, path_png, num=1):
    length = get_length(data_path)
    
    for offset in range(0,int(length),num):
        fig = plt.figure(figsize=(5.04, 2.16))
        ax = plt.gca()
        ax.axis('off')

        # load type         
        y, sr = librosa.load(data_path,offset=offset, duration=10)   
        X = librosa.stft(y)
        Xdb = librosa.amplitude_to_db(abs(X))
        librosa.display.specshow(Xdb, sr=sr, y_axis='hz', x_axis="off",ax=ax)

        fig.savefig ( path_png +"_"+str(num)+ str(offset) )
        plt.close(fig)
        gc.collect()


# In[4]:


def load_model(path="./model/"):
    json_file = open(path+"DeepMusic.json", "r")
    loaded_model_json = json_file.read()
    json_file.close()

    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights(path+"DeepMusic.h5")
    
    adam = keras.optimizers.Adam(learning_rate=0.001)
    loaded_model.compile(loss=keras.losses.categorical_crossentropy, optimizer=adam, metrics=['accuracy'])
    return loaded_model


# In[9]:


def load_data(data_path):
    x_data = []
    subdir = os.listdir(data_path)
    for idex, subdir in enumerate(subdir):
        img = cv2.imread(data_path+subdir,0)
        x_data.append(img/255)

    x_data = np.array(x_data)
    height = 216
    width = 504
    
    x_data = x_data.reshape(x_data.shape[0], height, width, 1)
    x_data = x_data.astype('float32')/255
    
    return x_data


# In[10]:


def get_music_name(y):
    predict = []
    label = ['GIVE_LOVE_AKMU', 'Palette_IU', '소녀_오혁', '여수_밤바다_버스커버스커', '스물셋_IU', '밤편지_IU', '방에_모기가_있어_10cm', '상어가족_핑크퐁', '삐삐_IU', '200%_AKMU']
    for y_index in y:
        predict.append(label[np.argmax(y_index)])
    
#     print(predict)
    result = Counter(predict).most_common(1)
    return result[0][0]


# In[11]:


def remove_file(fname, path):
#     shutil.rmtree(fname)
    shutil.rmtree(path)


# In[13]:


if __name__ == "__main__":
    try :
        # args로 경로 입력
        fname=sys.argv[1]
        path=fname+"_png/"
        os.mkdir(path)
        
        # 입력 받은 경로에 관한 이미지를 만들어서 저장
        save_wav(fname, path)
        
        # 이미지를 array 받아오기
        x = load_data(path)
        
        # model에게 입력을 준다.
        model = load_model(path="./deepmusic/model/")
        y = model.predict(x)
        
        # 예측값에서 가장 많이 나온거 찾는다.
        music_name = get_music_name(y)
        
        # 폴더와 wav파일 지운다.
        remove_file(fname, path)
        
        # 예측값을 return
        print(music_name)
    except Exception as ex:
        remove_file(fname, path)
        print("error")
