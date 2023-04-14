./build_oss_attrib_list.ps1
./build_frontend.ps1
./build_backend.ps1

if ($env:OS -like "*Win*"){
    Write-Host "Platform is Windows, building installer."
    ./build_win_installer.ps1
}
else{
    Write-Host "Platform not Windows, can't build WiX installer."
}