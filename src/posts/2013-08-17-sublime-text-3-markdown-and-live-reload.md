---
title: 'Sublime Text 3: Markdown and Live Reload'
date: 2013-08-17 11:18:32
excerpt: A quick setup guide for configuring the Markdown Preview and LiveReload packages for Sublime Text to play together nicely.
categories: development
tags:
- markdown
- st3
- sublime text
- web development

---
Recently I have started using the [Markdown syntax](http://en.wikipedia.org/wiki/Markdown) for all of my notes, to-do lists, etc. due to the readability it offers (not to mention I have been using a similar syntax of my own for years). Obviously one of the biggest perks to using Markdown is that you can quickly generate an HTML document from it for a more polished presentation.

I have also been using [Sublime Text](http://www.sublimetext.com/) for well over a year now, and I absolutely love it. I consider it to be a Vim/Notepad++ hybrid, bringing *nearly* all of my favorite features (more on that later...) from both together into one editor. Today I wanted to try using Markdown to actually generate an entire webpage, and I quickly realized that I would like to live preview my changes in a browser; enter the [Markdown Preview](https://github.com/revolunet/sublimetext-markdown-preview) and [LiveReload](https://github.com/dz0ny/LiveReload-sublimetext2) packages.

Setup for this was actually very simple, except for one oversight that took me far too long to resolve...

## Installation

1. The very first thing you should do when getting started with Sublime Text is to install [Package Control](https://sublime.wbond.net/installation) and familiarize yourself with it. Hit <kbd>CTRL+SHIFT+P</kbd> and type "Package" to find all of the relevant commands.
1. Next, use Package Control to install the aforementioned "Markdown Preview" and "LiveReload" packages.
1. Install the [LiveReload server application](http://feedback.livereload.com/knowledgebase/articles/67441-how-do-i-start-using-livereload-) for your OS of choice.
1. Install the [LiveReload browser extension](http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-) for your browser of choice.
1. Start the LiveReload server and add your project directory to the site folders.
    - **Important:** Markdown preview generates the HTML documents in a temporary folder by default (Windows: `C:\Users\<username>\AppData\Local\Temp\` by default)
1. Restart Sublime Text and your browser.

## Usage

1. Open up a Markdown file and use the "Markdown Preview: Preview in Browser" option (via <kbd>CTRL+SHIFT+P</kbd>) to generate an HTML document and open it in your default browser.
    - This can be bound to a hotkey, as described in the [Usage section of the Markdown Preview Github README](https://github.com/revolunet/sublimetext-markdown-preview#usage-).
1. Click the LiveReload button in your browser to enable the LiveReload functionality (the button's enabled state has a red dot in the middle of the icon).
1. Make some changes in your Markdown file and hit save; the HTML document in your web browser should automatically update.

## Issues

The only issue I had took me long enough to discover that I decided to document it here. Basically, **there are only certain file extensions for which the Markdown Preview package enables the LiveReload functionality by default**. I happen to save all of my Markdown files as ".txt" files, just in case I need to access them on my phone (or anywhere else that the ".md" or ".markdown" extensions could cause issues). Unfortunately, ".txt" is NOT one of the extensions that automatically has this support by default. Fortunately, there is a setting in the Markdown Preview package that controls which extensions should have the LiveReload functionality:

1. Using the menu, navigate as follows: `Preferences > Package Settings > Markdown Preview > Settings - User`
2. Insert the following block of text (assuming the file is blank; if the file already has content, just modify the `"markdown_filetypes"` line):

    ``` json
    {
        "markdown_filetypes": [".md", ".markdown", ".mdown", ".txt"]
    }
    ```

Obviously if your Markdown files use a different extension(s), update the list accordingly. I hope this saves someone else the time and frustration of not having your files auto-update.
