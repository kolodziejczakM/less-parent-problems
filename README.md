# less-parent-problems

## What's the problem?
When you working with "less-watch-compiler":

"Imagine" that you have 3 files. 
Layout.less, navbar.less and footer.less. 

Layout.less is the "parent file" that imports the rest. 
Normally if you perform any changes in footer or navbar file you will need to open layout.less and save it (even if he has not changed itself) to see what you change in his childs. That's because layout is the wrapper for all and less-watch-compiler runs only after change in that file (ctrl+s is a needed change).

NOTE: Problem occures only when you add just layout.css to your webpage. If you add all child files directly to webpage head you don't need less-parent-problems - you will see all changes immediately.

## Usage
Go to directory that contains less folder (parent directory), open terminal and type:
> less-watch-compiler less <css-output-directory>

Then open new terminal tab and type:
> less-parent-problems

After that the app ask for parent files that you wish to save automatically after each change in rest of files in less catalog.

<img src="https://www.cubbyusercontent.com/pl/lessParentGithubWithPath.png/_5b177abfddf84534981fff3f7ea71937" alt="terminal with less-parent-problems"/>

## Installation
> (sudo) npm install -g less-parent-problems

## Requirements
NodeJS and less-watch-compiler installed.

## License
Whole code is under MIT license. </br>
Permissions: *commercial use, distribution, modification, private use* </br>
Conditions: *License and copyright notice* </br>
Limitations: *Hold liable* </br>
