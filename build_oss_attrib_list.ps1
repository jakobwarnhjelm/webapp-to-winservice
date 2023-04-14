npm i -g oss-attribution-generator

Set-Location backend
generate-attribution
Copy-Item -Path ./oss-attribution/attribution.txt -Destination ../dist/oss_attribution_backend_autogen.txt

Set-Location ..

Set-Location frontend
generate-attribution
Copy-Item -Path ./oss-attribution/attribution.txt -Destination ../dist/oss_attribution_frontend_autogen.txt

Set-Location ../dist

$separator_line="`n####################################################"
$legal = "SOME CUSTOM EULA TEXT `nLorem ipsum ... `n"
$legal += $separator_line
$legal += "`nOPEN SOURCE LICENSES`n"
$legal += Get-Content ./oss_attribution_frontend_autogen.txt -Raw
$legal += Get-Content ./oss_attribution_backend_autogen.txt -Raw

$legal | Out-File ./LICENSES.txt -Force # Create a text file for the webapp to present
$legal | Out-File ../backend/public/html/LICENSES.txt -Force # Create a text file for the webapp to present

# Convert the .txt to a rudimentary RTF file. Expect extra work if you wan't to support non-latin characters
$non_stripped = Get-Content "./LICENSES.txt" -Raw 
$non_stripped_rtf = ($non_stripped -replace "`n","`n\line ") 
$eula ="{\rtf1\ansi{\fonttbl\f0\fswiss Helvetica;}\f0\pard

$non_stripped_rtf
 }
"
Out-File -InputObject $eula -FilePath "./eula.rtf" -Encoding ascii -Force #Wix/RTF/msi demands ascii och RTF

Set-Location ..
