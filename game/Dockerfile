#FROM httpd
#COPY . /usr/local/apache2/htdocs/
#RUN echo "ServerName localhost" >>  /usr/local/apache2/conf/httpd.conf
#RUN echo "Listen 8080" >>  /usr/local/apache2/conf/httpd.conf
#EXPOSE 8080

FROM registry.redhat.io/rhel8/httpd-24

# Add application sources
ADD . /var/www/html/index.html

CMD run-httpd