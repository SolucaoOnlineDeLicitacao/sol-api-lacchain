import sys
import subprocess

if(sys.argv[1] == None):
    sys.stdout.write("No file to convert")
    sys.stdout.flush()
    sys.exit(1)

if(sys.argv[3]== 'win32'):
  from docx2pdf import convert
  convert(sys.argv[1], sys.argv[2])
  sys.stdout.write("PDF created")
  
if(sys.argv[3]== 'linux'):
  # output = convert(source=sys.argv[1], output_dir=sys.argv[2], soft=1)
  outputDir=sys.argv[2].replace("/output.pdf","")
  try:
    output = subprocess.check_output(['libreoffice', '--headless', '--convert-to', 'pdf', sys.argv[1], '--outdir', outputDir])
    sys.stdout.write("PDF created")
  except subprocess.CalledProcessError as e:
    sys.stdout.write("Error: " + e.output)
    sys.stdout.flush()
    sys.exit(1)


sys.stdout.flush()