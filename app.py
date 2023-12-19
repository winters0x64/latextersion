import os
import uuid
from flask import Flask
from flask import send_from_directory
from flask import render_template
from flask import request,redirect,url_for

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './uploads'
app.config['OUTPUT_FOLDER'] = './outputs'

@app.route('/')
def index():
    return render_template('index.html')

# Upload handler
@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    _, file_extension = os.path.splitext(file.filename)
    if(file_extension != '.txt'):
        return "Can only Upload .txt files"
    # Generate random UUID for the uploaded files
    random_uuid = uuid.uuid4().hex
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], str(random_uuid)+'.tex'))
    # Insert the placeholder for the uploaded file inorder to get processed by the tex compiler
    with open(os.path.join(app.config['UPLOAD_FOLDER'], str(random_uuid)+'.tex'), 'r+') as f:
        content = f.read()
        f.seek(0, 0)
        f.write("\\documentclass{article}"+"\n" + "\\begin{document}"+"\n" + content+"\n" + "\\end{document}"+"\n")

    # call the tex compiler
    os.system('pdflatex -output-directory '+app.config['OUTPUT_FOLDER']+' '+app.config['UPLOAD_FOLDER']+'/'+str(random_uuid)+'.tex')
    # return the generated pdf
    return send_from_directory(app.config['OUTPUT_FOLDER'], str(random_uuid)+'.pdf')
    # return render_template(redirect(url_for('download', uuid=random_uuid)))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
