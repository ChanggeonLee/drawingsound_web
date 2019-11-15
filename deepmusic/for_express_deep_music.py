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


def save_wav(data_path, path_png):
    # length = get_length(data_path)
    # for offset in range(0,int(length),num):
    fig = plt.figure(figsize=(5.04, 2.16))
    ax = plt.gca()
    ax.axis('off')

    # load type         
    y, sr = librosa.load(data_path,offset=0, duration=10)
    S_full, phase = librosa.magphase(librosa.stft(y))
    librosa.display.specshow(librosa.amplitude_to_db(S_full, ref=np.max),
                    y_axis='hz', x_axis='off', sr=11025, ax=ax)
    # S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
    # S_dB = librosa.power_to_db(S, ref=np.max)
    # librosa.display.specshow(S_dB, y_axis='off', x_axis='off', sr=11025, ax=ax)
                        
    fig.savefig ( path_png + "vocal")
    plt.close(fig)
    gc.collect()


def save_wav_only_vocal_noise(data_path, path_png, noise):
    # length = get_length(data_path)
    # for offset in range(0,int(length),num):
    fig = plt.figure(figsize=(5.04, 2.16))
    ax = plt.gca()
    ax.axis('off')

    # load type         
    y, sr = librosa.load(data_path,offset=0, duration=10)
    y = add_noise(y, noise)
    S_full, phase = librosa.magphase(librosa.stft(y))
    librosa.display.specshow(librosa.amplitude_to_db(S_full, ref=np.max),
                        y_axis='hz', x_axis='off', sr=11025, ax=ax)

    fig.savefig ( path_png + "only_vocal_noise" )
    plt.close(fig)
    gc.collect()

def save_wav_only_vocal_pitch(data_path, path_png):
    # length = get_length(data_path)
    
    # for offset in range(0,int(length),num):
    fig = plt.figure(figsize=(5.04, 2.16))
    ax = plt.gca()
    ax.axis('off')

    # load type         
    y, sr = librosa.load(data_path,offset=0, duration=10)
    y = manipulate(y, sr)
    S_full, phase = librosa.magphase(librosa.stft(y))
    librosa.display.specshow(librosa.amplitude_to_db(S_full, ref=np.max),
                        y_axis='hz', x_axis='off', sr=sr, ax=ax)
    
    fig.savefig ( path_png +"only_vocal_pitch" )
    plt.close(fig)
    gc.collect()



# In[4]:


def load_model(path="./model/"):
    json_file = open(path+"DeepMusic.json", "r")
    loaded_model_json = json_file.read()
    json_file.close()

    loaded_model = model_from_json(loaded_model_json)
    loaded_model.load_weights(path+"DeepMusic.h5")
    
    adam = keras.optimizers.Adam(learning_rate=0.00005)
    loaded_model.compile(loss=keras.losses.categorical_crossentropy, optimizer=adam, metrics=['accuracy'])
    return loaded_model


# In[9]:


def load_data(data_path):
    x_data = []
    subdir = os.listdir(data_path)

    for idex, subdir in enumerate(subdir):
        img = cv2.imread(data_path+subdir,1)
        x_data.append(img/255)

    x_data = np.array(x_data)
    height = 216
    width = 504
    
    x_data = x_data.reshape(x_data.shape[0], height, width, 3)
    x_data = x_data.astype('float32')/255
    
    return x_data


# In[10]:


def get_music_name(y):
    predict = []
    label = get_label() 
    add = 0
    for y_index in y:
        index = np.argmax(y_index)
        predict.append(label[index])

    result = predict[0]+"/"+predict[1]+"/"+predict[2]
    return result

def get_label(label="./deepmusic/model/label.npy"):
    return np.load(label)


def remove_file(path):
    shutil.rmtree(path)

def add_noise(data, noise_factor):
    noise = np.random.randn(len(data))
    data_noise = data + noise_factor * noise
    return data_noise

def manipulate(data, sampling_rate):
    bins_per_octave = 12
    pitch_pm = 2
    pitch_change =  pitch_pm * 2*(np.random.uniform())
    return librosa.effects.pitch_shift(data, sampling_rate, pitch_change)


if __name__ == "__main__":
    try :
        # args로 경로 입력
        fname=sys.argv[1]
        path=fname+"_png/"

        try : 
            os.mkdir(path)
        except Exception as ex:
            remove_file(path)
            os.mkdir(path)
            
        # 입력 받은 경로에 관한 이미지를 만들어서 저장
        save_wav(fname, path)
        save_wav_only_vocal_noise(fname, path,0.005)
        save_wav_only_vocal_pitch(fname, path)
        
        # 이미지를 array 받아오기
        x = load_data(path)
        
        # model에게 입력을 준다.
        model = load_model(path="./deepmusic/model/")
        y = model.predict(x)
        
        # 예측값에서 가장 많이 나온거 찾는다.
        music_name = get_music_name(y)
        
        # 폴더와 wav파일 지운다.
        remove_file(path)
        
        # 예측값을 return
        print(music_name)
    except Exception as ex:
        remove_file(path)
        print("error")
