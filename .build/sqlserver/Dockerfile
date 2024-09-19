FROM mcr.microsoft.com/mssql/server:2022-preview-ubuntu-22.04


# Create app directory
WORKDIR /usr/src/app

# Copy initialization scripts
COPY ./entrypoint.sh /usr/src/app
COPY ./run-initialization.sh /usr/src/app
COPY ./init.sql /usr/src/app

# Run Microsoft SQL Server and initialization script (at the same time)
CMD /bin/bash ./entrypoint.sh