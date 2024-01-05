import { dirname, join } from 'path';
import { writeFile, readFile } from 'fs/promises';
import { exec } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
const util = require('node:util');




const UPLOAD_FOLDER = './uploads';
const OUTPUT_FOLDER = './outputs';

const server = Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    console.log(url.pathname);
    // Serve the index page
    if (url.pathname === '/') {
      return new Response(Bun.file(join(__dirname, 'index.html')));
    }

    // Handle file uploads
    if (url.pathname === '/upload' && request.method === 'POST') {
      try{
      const formData = await request.formData();
      const file = formData.get('file');
      const exec = util.promisify(require('node:child_process').exec);
      console.log(file);
      console.log(file.type);

      const randomUUID = uuidv4();
      const filePath = join(UPLOAD_FOLDER, `${randomUUID}.tex`);
      await writeFile(filePath, await file.text());

      let content = await readFile(filePath, 'utf8');
      content = "\\documentclass{article}\n\\begin{document}\n" + content + "\n\\end{document}\n";
      await writeFile(filePath, content);

      const { stdout,error } = await exec(`pdflatex -output-directory ${OUTPUT_FOLDER} ${filePath}`);
      if(error){
        console.log(error);
        return new Response('Error generating PDF', { status: 500 });
      }
      return new Response(Bun.file(join(__dirname, OUTPUT_FOLDER, `${randomUUID}.pdf`),{type: 'application/pdf'}));
      
    }catch(e){
      console.log(e);
      return new Response('Error generating PDF', { status: 500 });
    }
  }
  return new Response('Not found', { status: 404 });
}
});

console.log(`Server running at http://localhost:${server.port}`);
