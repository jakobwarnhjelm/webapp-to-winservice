##################################
# BACKEND
##################################

Set-Location backend
npm install -g pkg
npm i

# config.txt are included as a separate file (outside the .exe)
Copy-Item -Path ./config.txt -Destination ../dist/config.txt -Force

# package.json defines which extra static assets outside to bundle
pkg package.json --output=../dist/webapp-backend-win --target=win-x64

Set-Location ..