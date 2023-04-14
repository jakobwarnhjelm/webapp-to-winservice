##################################
# BUILD AND PUBLISH DOCS
##################################
Set-Location ./docs/qbatch
hugo
# robocopy .\public\ \\192.168.1.228\web\qbatch-docs /s /e /PURGE
# robocopy .\public\ ../../installer/include/public/docs /s /e /PURGE
# robocopy .\public\ ../../backend/public/qbatch-docs /s /e /PURGE
Remove-Item -Path "../../backend/build/public/docs/*"  -Exclude .gitignore -Force -Recurse -ErrorAction Ignore
Copy-Item -Path ".\public\*" -Recurse -Destination "../../backend/build/public/docs" #-Container
Set-Location ..
Set-Location ..