FROM mysql

MAINTAINER me 

CMD ["mysqld", "--lower_case_table_names=1"]

ADD init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306
