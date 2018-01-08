# cloud9-ngrok

This Docker image provides a development environment running the Cloud9 web IDE. If the appropriate arguments are passed, the resulting container will also create a public [ngrok](https://ngrok.com/) tunnel that allows remote colleagues to access the environment.

## Examples

### Simple

Cloud9 is exposed on port 80. Here, we spin up a container and map that port to port 8000 on our host machine.

    // You should now be able to access Cloud9 at http://localhost:8000
    $ docker run --name cloud9 --rm -p 8000:80 tkambler/cloud9-ngrok
    
### Restricting Access with Username / Password

To restrict access to Cloud9 with a username and password, pass additional options as show below.

    $ docker run --name cloud9 --rm -p 8000:80 tkambler/cloud9-ngrok --auth user:pass
    
### Enabling ngrok Tunnel

To create an [ngrok](https://ngrok.com/) tunnel that allows remote users to access your environment, pass additional options as show below. Note that when creating an ngrok tunnel, a username and password *must* be specified.

    $ docker run --name cloud9 --rm -p 8000:80 tkambler/cloud9-ngrok --auth user:pass --ngrok
    
### Enabling Collaborative Mode

To enable Cloud9's "collaborative" mode, pass additional options as shown below:

    $ docker run --name cloud9 --rm -p 8000:80 tkambler/cloud9-ngrok --auth user:pass --ngrok --collab

### Mounting a Local Volume into the Workspace

The Cloud9 workspace is located at `/workspace`. The following example demonstrates how one would go about mounting a host folder into the container's workspace.

	$ docker run --name cloud9 --rm -p 8000:80 -v $(pwd)/workspace:/workspace tkambler/cloud9-ngrok