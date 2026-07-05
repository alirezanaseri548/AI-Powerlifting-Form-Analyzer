# Local Development Notes

## Backend Health Check

Laptop:

powershell
Invoke-RestMethod http://localhost:3000/api/health

Phone browser:

txt
http://<YOUR-LAN-IP>:3000/api/health

## Find LAN IP on Windows

powershell
ipconfig

Use the IPv4 address of your Wi-Fi adapter.

Example:

txt
192.168.0.2

## Fix Port 3000 Conflict

powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F

## Common Mobile Error

txt
java.net.NoRouteToHostException: Host unreachable

Check:

- Backend is running.
- Phone and laptop are on same Wi-Fi.
- API URL uses laptop LAN IP, not localhost.
- Windows Firewall allows Node.js.
- Port 3000 is not blocked.
