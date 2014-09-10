#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
IDAPython script for IDA 6.X to create structures from VTables.

Usage
-----

Either create an array of functions by pressing '*' in the start of the VTable and setting the number of elements in the array or just select the whole VTable and execute this script. The generated output structure will be printed out to the output window.

Common problems
---------------

If some function doesn't have a prototype and IDA fails to guess the prototype you will find functions in the output like this:

(...)
  int();
(...)

  Change the prototype for such functions, select the area and execute again the script.
"""

import os
import time
import idaapi

def log_msg(amsg):
  print ("[%s] %s" % (time.asctime(), amsg))

def get_true_name(f):
  name = GetFunctionName(f)
  if name is None or name == "":
    d = dict(Names())
    if d.has_key(f):
      name = d[f]
  return name

def get_demangled_name(name):
  name = get_true_name(name)
  demangled = Demangle(name, INF_SHORT_DN)
  # Is the function name mangled?
  if demangled is not None:
    name = demangled.replace("::", "_").replace("`", "").replace("'", "").replace(" ", "_")
  return name

def is64():
  return BADADDR != 0xFFFFFFFF

class CVTableStructGenerator(object):
  def __init__(self, ea, end_ea = BADADDR):
    self.ea = ea
    self.end_ea = end_ea
    self._debug = False
  
  def debug(self, msg):
    if self._debug:
      log_msg(msg)

  def get_struct(self):
    struct_name = get_demangled_name(self.ea)
    if self.end_ea != BADADDR:
      size = self.end_ea - self.ea
    else:
      size = ItemSize(self.ea)
    if is64():
      step_size = 8
    else:
      step_size = 4

    ret = ["struct %s" % struct_name]
    ret.append("{")
    ea = self.ea
    i = 0
    while ea < self.ea + size and ea != BADADDR:
      func = Dword(ea)
      self.debug("Function 0x%x" % func)
      func_type = GetType(func)
      if func_type is None:
        func_type = GetType(func)
        if not func_type:
          func_type = GuessType(func)
      func_name = get_demangled_name(func)
      if func_type is not None:
        if func_type.find("__cdecl") > -1:
          func_type = func_type.replace("__cdecl", "(__cdecl *%s)" % func_name)
        elif func_type.find("__stdcall") > -1:
          func_type = func_type.replace("__stdcall", "(__stdcall *%s)" % func_name)
        elif func_type.find("__fastcall") > -1:
          func_type = func_type.replace("__fastcall", "(__fastcall *%s)" % func_name)
        elif func_type.find("__thiscall") > -1:
          func_type = func_type.replace("__thiscall", "(__thiscall *%s)" % func_name)
        elif func_type.find("__usercall") > -1:
          func_type = func_type.replace("__usercall", "(__usercall *%s)" % func_name)
        elif func_type.find("__userpurge") > -1:
          func_type = func_type.replace("__userpurge", "(__userpurge *%s)" % func_name)
        elif func_type.find("[") > -1:
          func_type = func_type.replace("[", " %s[" % get_demangled_name(func))
      else:
        if func_name is None or func_name == "":
          func_type = "_DWORD dword%x" % (i * 4)
        else:
          func_type = "_DWORD %s%x" % (func_name, i * 4)
      ret.append("  %s;" % func_type)
      ea += step_size
      i += 1
    ret.append("};")
    return "\n".join(ret)

def main():
  if SelStart() != BADADDR:
    tsgen = CVTableStructGenerator(SelStart(), SelEnd())
  else:
    tsgen = CVTableStructGenerator(here())
  print tsgen.get_struct()

if __name__ == "__main__":
  main()
