import random
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

def apply_motion(d, stepsize):
    d[0] += d[2] * stepsize
    d[1] += d[3] * stepsize
    d[2] = max(-1.4, min(1.4, d[2] + random.gauss(0, stepsize)))
    d[3] = max(-1.4, min(1.4, d[3] + random.gauss(0, stepsize)))

def gen_data(filename, size=300):
    start = np.array([0.0, 0.0, 0.0, 0.0])
    data = np.zeros((size, 4))
    data[0, :] = start
    maxdist = 0.01
    for i in range(1, size):
        apply_motion(start, 0.1)
        data[i, :] = start
        dist = np.linalg.norm(data[i-1, [0, 1]] - data[i, [0,1]])
        maxdist = max(maxdist, dist)
        print(data[i, :])
        plt.plot(data[[i-1, i], 0], data[[i-1, i], 1], color=(dist/maxdist, 1-(dist/maxdist), 0))
    plt.show()
    df = pd.DataFrame(data[:, [0,1]])
    df.to_csv(filename)

def read_walk(filename):
    df = pd.read_csv(filename)
    print(df)
    print(df.columns)
    plt.plot(df[['realx']], df[['realy']], color='g')
    plt.plot(df[['noisex']], df[['noisey']], color='r')
    plt.plot(df[['estx']], df[['esty']], color='b')
    plt.show()
