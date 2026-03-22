#!/bin/bash

# Enable Rewrite Mode (Necessary for React Router)
echo "[After Install INFO] Enabling Rewrite Mode......." 
a2enmod rewrite

# Enable Proxy Modules
echo "[After Install INFO] Enabling Apache Modules......." 
a2enmod proxy
a2enmod proxy_http
a2enmod proxy_balancer

# Enable .htaccess overrides for React SPA routing
echo "[After Install INFO] Enabling .htaccess Overrides for React SPA Routing......." 
sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf


# Create .htaccess File s(The "Magic" for React Router)
echo "[After Install INFO] Creating .htaccess File......." 
cat <<EOF > /var/www/html/.htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
EOF

# Fix Permissions and Restart
echo "[After Install INFO] Fixing Apache Permissions and Reatarting it......." 
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

# Restart Apache
echo "[After Install INFO] Restarting Apache......." 
systemctl restart apache2

echo "[After Install INFO] Deployment Complete!"