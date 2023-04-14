
##################################
# FRONTEND
##################################
Set-Location frontend

npm i
npm run build

Remove-Item -Path ../backend/react/* -Exclude .gitkeep -Recurse -ErrorAction Ignore
Copy-Item -Path "./build/*" -Recurse -Destination ../backend/react/
Set-Location ..


