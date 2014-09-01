#! /usr/bin/python
# 
# This is a helper file to convert content to android. It's not done, but it helps with the manual labor
# Due to manifest file structure, this script will not be useful on the plus folder
#
# usage1: just move into the directory containing webgame.js and Content/, then run this script.
# usage2: call it with any number of png files as arguments and it will convert them and store them in android/ folder
# 
#

# TODO figure out what *magick tool is being used and set a variable

import sys
import re
from os import popen
from os import chdir
#from string import *
from subprocess import Popen, PIPE

cmd=popen("which sips").read()

if(len(cmd)):
	mode="sips"
else:
	mode="gm"
	
#print "using mode: " + mode

# TODO check if someone called 'python ' instead of './' and call them an idiot
for a in sys.argv[1:]:
	#print "arg %s found" % a
	if (a == "subdirs"):
		# TODO check that we are called from our own directory
		items = popen("ls -p").read().split("\n")[:-1]
		for i in items:
			if (i.endswith('/')):
#				chdir(i)
				popen("cd %s; .%s" % (i, sys.argv[0]))


# Uses the non-deprecated python method for runnning os commands, which kinda sucks.
def runCmd(cmd, arg = ""):
	#print cmd + " " + arg
	return Popen([cmd, arg], stdout=PIPE).communicate()[0]

# Uses the simple python method and runs command cmd with args one and two separated by spaces
def doCmdTwo(cmd, one, two):
	return popen(cmd + " " + one + " " + two)

def getDim(file):
	if( mode == "sips" ):
		return getSipsDim(file)
	else:
		return getGmDim(file)

# Return (w, h) of the specified file
def getGmDim(file):
	info = popen("gm identify " + file).readline()
	dimm = info.split(" ")[2].split("x")
	return (eval(dimm[0]), eval(dimm[1]))

def parseIntDim(s):
	return eval(re.search('([0-9]+)', s).group(0))

def getSipsDim(file):
	width = parseIntDim(popen("sips --getProperty pixelWidth '%s'" % (file)).readlines()[1])
	height = parseIntDim(popen("sips --getProperty pixelHeight '%s'" % (file)).readlines()[1])
	return (width, height)

def doFormat(file,w,h,newd,dest):
	#print "entering doformat"
	#print "mode is" + mode
	
	if(mode=="sips"):
		return doSipsFormat(file,w,h,newd,dest)
	else:
		return doGmFormat(file,w,h,newd,dest)

def doSipsFormat(file,w,h,newd,dest):
	#print "entering sipsformat"
	fmt = "sips --resampleHeightWidth %d %d '%s'" % (newd, newd, dest)
	cmd = "cp '%s' '%s'" % (file, dest)
	if ((w != h) | (w != newd)):
		#args =  file + " -resize %dx%d! -define png:color-type=6 " % (newd,newd) + dest
		#cmd = "`which gm` convert " + args
		print ('Resizing %s (%dx%d) to %d' % (file, w, h, newd))
		cmd = cmd + ";" + fmt
	else:
		#print "copying file " + file + " it has size %dx%d." % (w, h)
		pass

	#print cmd
	return popen(cmd)

def doGmFormat(file,w,h,newd,dest):
	if ((w != h) | (w != newd)):
		args =  file + " -resize %dx%d! -define png:color-type=6 " % (newd,newd) + dest
		print ('Resizing %s (%dx%d) to %d' % (file, w, h, newd))
		cmd = "gm convert " + args
	else:
		#print "copying file " + file + " it has size %dx%d." % (w, h)
		cmd = "cp " + file + " " + dest

	print cmd
	return popen(cmd)


# Turns file into the closest largest 2^ square at location dest
def square(file, dest):
	(w, h) = getDim(file)

	if (w > h):
		max = w
	else:
		max = h

	#print "using max dimmension %d" % max

	if (max <= 32):
		newd = 32
	elif max <= 64:
		newd = 64
	elif max <= 128:
		newd = 128
	elif max <= 256:
		newd = 256
	elif max <= 512:
		newd = 512
	else:
		newd = 1024
		
	#print "final dimension %d" % newd

	return doFormat(file,w,h,newd,dest)


# TODO rename this. It's not just png2prv
def prv2png(manifest):
	cont = open(manifest, 'r').readlines()
	out = []
	for i in cont:
		tmp = i.replace('.pvr', '.png')
		out.append(tmp.replace('PackagedData', 'Content'))
	open(manifest, 'w').writelines(out)

## squareify images into new directory
if(len(sys.argv) == 2):
	print sys.argv[1]
	square(sys.argv[1],sys.argv[1])
	print 'File size adjusted.'
else:
	print 'No file input!'

print 'Done!'
print

