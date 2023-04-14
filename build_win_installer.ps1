##################################
# CREATE WIX INSTALLER
##################################
Set-Location dist

Remove-Item  .\webapp_msi.wixpdb -ErrorAction Ignore
Remove-Item  .\webapp_msi.wixobj -ErrorAction Ignore
candle.exe ..\webapp_msi.wxs
light.exe -ext WixUIExtension webapp_msi.wixobj -out webapp.msi


Set-Location ..


##################################
# UNINSTALL AND INSTALL MSI
##################################
# Set-Location installer
# msiexec.exe /x qbatch.msi /q
# msiexec.exe /i foo.msi /q
# Set-Location ..


