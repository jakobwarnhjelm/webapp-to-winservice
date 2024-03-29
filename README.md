# webapp-to-winservice

## What is this project?
A template project to deploy a Node.js-app with a React frontend as a Windows service.
The React app is served as static files by the Node.js backend. 

The Node.js backend interacts with the local filesystem, text files suitable for settings and also a SQLite database.

It will output an `.msi` -file, that when installed sets up a Windows service. The app will accept start and stop signals from the Windows service manager.

If you install e.g. PostgreSQL separately on the same machine, this template has the potential to create a complete enterprise on-premise app using a Node.js + React codebase.

The reason the project exists in the first place is that one of my unfinished projects were supposed to be possible to install on-premise. It wasn't finished, much because it took so ridiculously long time to wrap Node.js inside a Windows service. Hopefully someone else can make use of it!

You will need to understand npm, Node.js, React and a tiny bit about Windows applications to read this codebase.

I have written up some more details about the app architecture in an Amazon self-published book available through here The repository accompanies the book https://www.jakobwarnhjelm.com/deploy-a-modern-web-app-on-win-server/index.html.


## But why?
One motivation is enterprise IT environments where there might be only Windows server available, and on-premise being the only option due to security rules.


## Screenshots 
Behold the innate beauty of the running template app:

![](/readme_img/webappwinservice_startpage.png "Start page")

The image above displays the start page. The red/orange block is a React component, where the contents of the SQLite call are passed from backend to frontend and displayed with a javascript update of the DOM.

The grey block are a few endpoints of the Node.js backend displayed in an iframe. The grey block is itself an EJS HTML template rendered by the backend Node.js app.

The links have the following purpose:
- Static file: render static html file bundled with Node.js-app
- License file: show collected open source licenses (same text file included in both web app and and `.msi`)
- JSON response from SQLite: same thing as in the orange block, without passing React first
- Config file: demonstrate capability to read current content of text file on disk (hitting the endpoint triggers disk read)
- Working directory: Demonstrate that Windows services are launched in `C:\Windows\system32` by default 

Tip: search the codebase for keywords from the rendered page to see where they are in the folder structure.

![](/readme_img/webappwinservice_config_file.png "View values from text file on disk")

Image above: How it looks when click the "config file" link in the grey block.

![](/readme_img/webappwinservice_workingdir.png "Managing to get out of the SYSTEM32-directory is essential when writing application specific files")

Image above: How it looks when click the "working directory" link in the grey block.

## Get your build environment ready (tested on Windows Server 2019)
- Windows (necessary for the `.msi` installer)
- Assumption: Python or Visual Studio is not installed previously
- Git: to clone this repo. https://git-scm.com/ 
- Node.js (use 18.x , there are some incompatibilities with Node.js 20)
  - Check https://nodejs.org/en/about/previous-releases for download links
  - Skip "Tools for native modules", we will install it manually instead.
  - Test that `node` and `npm` commands are available in a terminal
  - When the ordinary Node.js -installation is finished. Install node-gyp dependencies. The official instructions instructions on https://github.com/nodejs/node-gyp#on-windows are a bit vague. Shortcut below:
    - Install Vs Build tools https://aka.ms/vs/16/release/vs_buildtools.exe. Credit to https://stackoverflow.com/a/70516326 for the direct link. When the Visual Studio installer launches, install the complete workload for **Desktop development with C++**. It will occupy a few GB of space.
    - Install Python 3.11 from https://www.python.org/downloads/ (because of https://github.com/nodejs/node-gyp/issues/2869 we have to avoid 3.12). Run installer as admin.
- WiX toolset 3.11 https://github.com/wixtoolset/wix3/releases/tag/wix3112rtm 
  - Depends on .NET-framework 3.5. Install through Windows Server Manager or https://www.microsoft.com/en-US/download/details.aspx?id=21
  - Add C:\Program Files (x86)\WiX Toolset v3.11\bin to `PATH` after installing WiX toolset

## Relevant entries to `PATH` after installation 
Verify that your system wide PATH variable on your Windows machine have entries similar to these:
- C:\Python311\Scripts\
- C:\Python311\
- C:\Program Files\Git\cmd
- C:\Program Files (x86)\WiX Toolset v3.11\bin
- C:\Program Files\nodejs\

Visual Studio build tools are hard-references to their installation folder, thus not present in PATH. So if you have modified your Visual Studio installation,  you might need to configure node-gyp to properly detect the build tools.


  ## Building
  - Open an elevated (admin) powershell terminal
    - Try also an non-elevated terminal, it might work without admin right. It depends on the node-gyp setup.
  - Clone this repository
  - Navigate into the repository and run `.\build.ps1`

The build script will not exit if an underlying npm step fails. So you will have to check the console output for errors.

 ## Disposition of code base
The code base consists of 
- Node.js
- React
- WiX (template language for Windows installers)

The project is build by running `build.ps1`, which also makes it a good starting point for reading the codebase.

The other `.ps1`-files are called through `build.ps1` and serves the following purposes:
- build_oss_attrib_list.ps1 : collect open source licenses from React and Node.js `package.json` -files
- build_frontend.ps1 : build the React project using `npm`, copy artifacts after build to be served by Node.js-app.
- build_backend.ps1: use `pkg` to package the the Node.js project as `.exe`-file (pkg is installed globally)
- build_win_installer.ps1: Package binaries into `.msi`-installer that installs as Windows-service. Configured through `webapp_msi.wxs`.

**Recommendation for troubleshooting**: start by running each of the build scripts above separately and make them work (in the order above). The React parts (`build_frontend.ps1`) are not necessary, if outdated npm packages causes trouble. Conceptually it is just static html and .js files. The important part is the Node.js-app and how `os-service` interacts with Windows service manager.

Running in an elevated powershell terminal might be necessary, due to npm triggering node-gyp, trigger install of VisualStudio components.

The different folders at the root level are:
- `.\backend`: The Node.js-project
- `.\dist`: Where the built files are copied
- `.\frontend`: The React project
- `.\iis`: Example files for running a reverse proxy using the IIS webserver (development purposes)


## After successful build
When you have succeeded as far as building the backend part, there will be a binary `.\dist\webapp-backend-win.exe`. Start that exe-file from a terminal and go to `http://localhost:4000`. If it works, it will show a sample page with data from different layers of the app, which are more explained in the book. Remember to exit the process when finished.

Now try to run the `.msi`-installer you build in the last step `build_win_installer.msi` . Use default settings. After successful install, go to Windows services and start the new service "WebappToMsiService". When you open `http://localhost:4000` it should look the same as it did previously.

Congrats! You have now managed to deploy a Node.js-app on Windows Server!

