import os

def split_paragraphs_to_files(input_file, output_folder):
    # Read the entire content of the input file
    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.read()

    # Split the content into paragraphs based on double newlines
    paragraphs = content.split('\n\n')

    # Ensure the output directory exists
    os.makedirs(output_folder, exist_ok=True)

    # Write each paragraph to a new file
    for i, paragraph in enumerate(paragraphs):
        # Remove leading/trailing whitespace and skip empty paragraphs
        paragraph = paragraph.strip()
        if not paragraph:
            continue

        # Create a numbered filename with three digits
        output_filename = os.path.join(output_folder, f'{i+1:03}.txt')

        # Write the paragraph to the output file
        with open(output_filename, 'w', encoding='utf-8') as output_file:
            output_file.write(paragraph)

        print(f'Created {output_filename}')

# Example usage
input_file = 'input.txt'
output_folder = 'output_paragraphs'
split_paragraphs_to_files(input_file, output_folder)
