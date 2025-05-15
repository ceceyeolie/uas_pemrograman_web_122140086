import os

def collect_source_files(src_dir, extensions=('.js', '.jsx', '.ts', '.tsx')):
    source_files = []
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(extensions):
                full_path = os.path.join(root, file)
                source_files.append(full_path)
    return source_files

def write_combined_output(files, output_path):
    with open(output_path, 'w', encoding='utf-8') as outfile:
        for file_path in files:
            outfile.write(f"// --- {file_path} ---\n")
            with open(file_path, 'r', encoding='utf-8') as infile:
                outfile.write(infile.read())
                outfile.write('\n\n')

if __name__ == "__main__":
    src_directory = './src'
    output_file = 'output.txt'
    
    react_files = collect_source_files(src_directory)
    write_combined_output(react_files, output_file)

    print(f"✅ Combined {len(react_files)} files into '{output_file}'")
