import numpy as np
import os

templatehead = """
#!/bin/bash
#SBATCH --ntasks 1
#SBATCH --mem 128
#SBATCH -o results/logs.%N.%j.out
#SBATCH -t 0:00:45
"""

template = """
./runner --config <(cat <<EOF
{{
  "InputFile": "{0}",
  "OutputFile": "{1}",
  "AccelerationSTDD": {2:f},
  "ImportanceSTDD": {3:f},
  "NoiseInjectionSTDD": {4:f},
  "RunNumber": {5} 
}}
EOF
)
"""

outdir = 'jobs/'
outfile = 'results/results_{0:06}.csv'
inputfilesdir = 'walks'
jobsperfile = 100
noise = 9.0
runs = 30
bsize = 10

def expsample(n=100):
    return -np.log10(np.random.random_sample(n))


if __name__ == '__main__':
    jobn = -1
    jobc = -1
    currb = 0
    fout = None
    for root, dirs, files in os.walk('walks'):
        importance = 100 * expsample(jobsperfile * len(files))
        accel = 1 * expsample(jobsperfile * len(files))

        for f in files:
            # jobs per input file
            for n in range(jobsperfile):
                # If we need a new submit job
                if currb % bsize == 0:
                    jobn += 1
                    if fout is not None:
                        fout.close()
                    fout = open(outdir + '/job_{0:06}.sh'.format(jobn), 'w')
                    print(templatehead, file=fout)

                print(template.format(root + "/" + f, outfile.format(jobn),
                    accel[jobc], importance[jobc], noise, runs), 
                    file=fout)
                currb += 1
                jobc += 1
