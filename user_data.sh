#!/bin/bash

# Debian Frontend Noninteractive
export DEBIAN_FRONTEND=noninteractive

# Update the Server
echo "[Launch Template INFO] Updating The Server......." 
sudo apt-get update
sudo apt-get -o Dpkg::Options::="--force-confold" upgrade -q -y

# Install Apache & Enable it
echo "[Launch Template INFO] Installing Apache & Enable it......." 
sudo apt-get install apache2 -y
sudo systemctl start apache2
sudo systemctl enable apache2

# Enable Proxy Modules
echo "[Launch Template INFO] Enabling Proxy Modules......." 
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer

# Configure the Virtual Host File for Reverse Proxy
echo "[Launch Template INFO] Configuring Apache VirtualHost for Reverse Proxy......." 
cat <<EOF > /etc/apache2/sites-available/000-default.conf
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    # Forward APIs Requests to Internal NLB
    ProxyPreserveHost On
    ProxyPass /api/ http://ci-cd-nlb-dba5e67897614788.elb.us-east-1.amazonaws.com:5253/api/        
    ProxyPassReverse /api/ http://ci-cd-nlb-dba5e67897614788.elb.us-east-1.amazonaws.com:5253/api/

    <Directory /var/www/html>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF


sudo systemctl enable apache2
sudo systemctl restart apache2

# install CodeDeploy Agent
echo "[Launch Template INFO] Installing CodeDeploy Agent......."
sudo apt-get install -y ruby-full
sudo apt-get install -y wget
cd /home/ubuntu
wget https://aws-codedeploy-us-east-1.s3.us-east-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo systemctl enable codedeploy-agent
sudo systemctl start codedeploy-agent

echo "[Launch Template INFO] Environment Setup Completed Successfully!"