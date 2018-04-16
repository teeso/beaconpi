import numpy as np
import os

templatehead = """
#!/bin/bash
#SBATCH --ntasks 1
#SBATCH --mem 128
#SBATCH -o results/logs.%N.%j.out
#SBATCH -t 1:00:0
"""

template = """
./runner --window --config <(cat <<EOF
{{
  "InputFile": "{0}",
  "OutputFile": "{1}",
  "NoiseInjectionSTDD": {2:f},
  "RunNumber": {3},
  "WindowSize": {4}
}}
EOF
)
"""

outdir = 'jobs/'
outfile = 'results/results_{0:06}.csv'
inputfilesdir = 'walks'
noise = 9.0
runs = 30
bsize = 100
windowsize_max = 30

if __name__ == '__main__':
    jobn = -1
    jobc = -1
    currb = 0
    fout = None
    for root, dirs, files in os.walk('walks'):
        for f in files:
            for winsize in range(2, windowsize_max):
                # If we need a new submit job
                if currb % bsize == 0:
                    jobn += 1
                    if fout is not None:
                        fout.close()
                    fout = open(outdir + '/job_{0:06}.sh'.format(jobn), 'w')
                    print(templatehead, file=fout)

                print(template.format(root + "/" + f, outfile.format(jobn),
                    noise, runs, winsize), 
                    file=fout)
                currb += 1
                jobc += 1
