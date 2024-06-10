import os
import sys
import json

def process_directory(dir_path):
    # Perform some operation on the directory
    # (e.g., list files, count files, process files, etc.)
    files = os.listdir(dir_path)
    num_files = len(files)
    result = {
    'from':'python',
    'status': 'success',
    'length': num_files,
    'message': 'Processed input successfully'
    }
    return result
   

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Directory path not provided.", file=sys.stderr)
        sys.exit(1)
    else:
        dir_path = sys.argv[1]
        result = process_directory(dir_path)
        
        # Output the result as JSON
        print(json.dumps(result)) # convert to json 
        sys.stdout.flush()

        #In Python, output buffering can sometimes cause delays or incomplete output when writing to streams like stdout.
        #sys.stdout.flush() forces Python to write any buffered output to the stdout stream immediately.

# Python uses buffered I/O for performance reasons, which means that output is not immediately written to the output stream (stdout). 
# Instead, it is buffered in memory until certain conditions are met (e.g., a newline character \n is encountered, or the buffer reaches a certain size),
#  at which point the buffered data is flushed (written) to the output stream.
