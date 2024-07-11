# GitCompose AKA "gitco"

A simple CLI tool for automatic deployment of docker-compose.yml located in git repositories.

# Why
I love docker-compose when I do local development - All you need is a small docker-compose.yml file to spin up a backend, a frontend and a database on you machine.

However, the cloud has limited support for docker-compose. Often the frontend, the backend and the database needs to be "deployed" in three different ways - Furthermore, it quite expensive!

gitco tries to simplify the deployment of docker-compose projects to a server (maybe a small Raspberry Pi)

gitco provides:
- Automatic deployment based on git changes
- Simple deployment of an entire stack with docker-compose
- Saving dollars by skipping the cloud
- Handling of secrets (Coming...)

# Installation 
```
npm install -g @philter87/gitco
```

# Usage

Create a 'gitco.json' file on your home server. The file "points" to a github repository with an app and a docker-compose file:
```json
// gitco.json
{
    "apps": [
        {
            "githubRepo": "your-name/awesome-app"
        }
    ]
}
```

Validate the server environment and try to do a deployment

```
# (Optional) Validate the server environment
gitco validate

# Deploy the app
gitco deploy gitco.json
```

If everything works, then you can enable automatic deployment with the following command:

```
gitco auto-deploy gitco.json
```

Every minute a script will check for changes in the git repository and make a deployment if needed.

# Development 

## Install gitco locally based on the code
```
npm install -g .
```