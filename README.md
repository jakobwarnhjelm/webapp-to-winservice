# webapp-to-winservice
The repository accompanies the book https://www.jakobwarnhjelm.com/webapp-to-winservice 

In-depth documentation is available in the book. This text mainly concerns how to buiild the project.

## What is this project?
A template project to deploy a Node.js-app with a React frontend as a Windows service.

But why?
One motivation is enterprise IT environemnts where there might be only Windows server available, and on-prem being the only option due to security rules.


## Get your build environment ready (tested on Windows Server 2019)
- Windows (necessary for the `.msi` installer)
- Assumption: Python or Visual Studio is not installed previously
- Node.js (use 18.x , there are some incompatibilities with Node.js 20)
  - Check https://nodejs.org/en/about/previous-releases for download links
  - Skip "Tools for native modules", we will install it manually instead.
  - Test that `node` and `npm` commands are available in a termninal
  - When the ordnariy Node.js -installation is finished. Install node-gyp dependencies. The official instructions instructions on https://github.com/nodejs/node-gyp#on-windows are a bit vague. Install instead as below:
    - Install Vs Build tools https://aka.ms/vs/16/release/vs_buildtools.exe. Source: https://stackoverflow.com/a/70516326 .
    - Install Python 3.11 from https://www.python.org/downloads/ (because of https://github.com/nodejs/node-gyp/issues/2869 )
- WiX toolset 3.11 https://github.com/wixtoolset/wix3/releases/tag/wix3112rtm 
  - Depends on .NET-framework 3.5. Install through Windows Server Manager or https://www.microsoft.com/en-US/download/details.aspx?id=21
  - Add C:\Program Files (x86)\WiX Toolset v3.11\bin to `PATH` after installing WiX toolset



//TODO infoga miljövariabler
//TODO byggskriptet smäller inte snyggt
  
  It will launch a separate script after the standard Node.js installation. If this script fails, install Visual studio build tools 2019 manually (https://aka.ms/vs/16/release/vs_buildtools.exe). See here https://stackoverflow.com/a/70516326 for details.


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

Recommendation: start by running each of the build scripts above separately and make them work (in the order above). The React parts (`build_frontend.ps1`) are not necessary, if outdated npm packages causes trouble. Conceptually it is just static html and .js files. The important part is the Node.js-app and how `os-service` interacts with Windows service manager.

Running in an elevated powershell terminal might be necessary, due to npm triggering node-gyp, trigger install of VisualStudio components.

The different folders at the root level are:
- .\backend: The Node.js-project
- .\dist: Where the built files are copied
- .\frontend: The React project
- .\iis: Example files for running a reverse proxy using the IIS webserver (development purposes)


## After successful build
When you have succeeded as far as building the backend part, there will be a binary `.\dist\webapp-backend-win.exe`. Start that exe-file from a terminal and go to `localhost:4000`. If it works, it will show a sample page with data from different layers of the app, which are more explained in the book. Remember to exit the process when finished.

Now try to run the `.msi`-installer you build in the last step `build_win_installer.msi` . Use default settings. After successful install, go to Windows services and start the new service "WebappToMsiService". When you open `localhost:4000` it should look the same as it did previously.

Congrats! You have now managed to deploy a Node.js-app on Windows Server!