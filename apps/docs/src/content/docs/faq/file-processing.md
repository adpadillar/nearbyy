---
title: How does Nearbyy process files?
description: Understanding what happens when you upload a file to Nearbyy
sidebar:
  order: 1
---

When you upload a file to the Nearbyy platform, the first step is to check wether the file type is supported. The way the file type is determined is by checking the `Content-Type` header of the file, **not the file extension**. If the filetype is supported, the file is then processed by the Nearbyy platform.

## Supported filetypes

| File Type | Content-Type (or MIME type)                                                 |
| --------- | --------------------------------------------------------------------------- |
| Markdown  | `text/markdown`                                                             |
| Text      | `text/plain`                                                                |
| PDF       | `application/pdf`                                                           |
| MP3       | `audio/mpeg`                                                                |
| Docx      | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`   |
| Pptx      | `application/vnd.openxmlformats-officedocument.presentationml.presentation` |
| HTML      | `text/html`                                                                 |
| Jpeg,Jpg  | `image/jpeg`                                                                |
| Png       | `image/png`                                                                 |

:::tip[Your file type is not supported?]
We plan to aggressively expand the list of supported file types. If you want to request support for a file type, please [contact us](mailto:adpadillar25@gmail.com).
:::

## Processing the file

After the file type is determined, different parsing strategies are used depending on the file type. In the following sections, we will explain how each file type is processed.

### Markdown and Text

For Markdown and Text files, the process is very straightforward. The plain text content of the file is extracted "as is", to be used by the next steps in the pipeline.

### PDF

For PDF files, we do our very best to extract all of the "selectable" text on the PDF. Notably, that means that text that is part of an image or scanned document will not be extracted. One of the future improvements we are working on is to support OCR for scanned documents, or images inside PDFs.

### MP3

For MP3 files, we use a speech-to-text service to extract the text from the audio. This is the text that will be used by the next steps in the pipeline. Currently, the most supported languages are English and Spanish.

### Docx and Pptx

For Docx and Pptx files, we do something really similar to what we do with PDFs. We extract all of the "selectable" text on the document, and use that text for the next steps in the pipeline. OCR is not supported for these file types, but it is something we are working on.

### HTML

HTML files have a very specific process:

1. We extract the raw text (HTML) from the file
2. We then clean the HTML, removing sections that are not relevant for the text extraction, such as navigation bars, footers, etc.
3. We convert the cleaned HTML into markdown, getting rid of all the HTML tags.
4. The markdown is then used by the next steps in the pipeline.

If for some reason, you are having issues by the way we are processing your HTML files, and you feel like the Markdown or Text pipeline would be more adecuate, serve your HTML files as plain text files, with the `Content-Type` header set to `text/plain`.

### Jpeg, Jpg and Png

For image files, we use OCR to extract the text from the image. This is the text that will be used by the next steps in the pipeline. Currently, the most supported languages are English and Spanish.
