#!/bin/bash

echo "[Before Install INFO] Starting Before Install Script...."

# Stop Apache
echo "[Before Install INFO] Stopping Apache...."
systemctl stop apache2

# Clean /var/www/html and Copy dist Files
echo "[Before Install INFO] Cleaning /var/www/html and Copy dist Files......." 
rm -rf /var/www/html/*

echo "[Before Install INFO] Deployment Stopped!"