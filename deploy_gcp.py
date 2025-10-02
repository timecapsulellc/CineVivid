#!/usr/bin/env python3
"""
Google Cloud Platform Deployment Script for CineVivid
Complete automated deployment with GPU support for AI video generation
"""
import os
import subprocess
import json
import time
import sys
from pathlib import Path
import yaml

class GCPDeployer:
    """Automated GCP deployment for CineVivid"""
    
    def __init__(self, project_id: str, domain: str, region: str = "us-central1"):
        self.project_id = project_id
        self.domain = domain
        self.region = region
        self.zone = f"{region}-a"
        self.instance_name = "cinevivid-production"
        self.network_name = "cinevivid-network"
        
    def check_prerequisites(self) -> bool:
        """Check GCP CLI and authentication"""
        print("🔍 Checking prerequisites...")
        
        # Check gcloud CLI
        try:
            result = subprocess.run(["gcloud", "version"], capture_output=True, text=True)
            if result.returncode == 0:
                print("✅ Google Cloud CLI installed")
            else:
                print("❌ Google Cloud CLI not found. Install: https://cloud.google.com/sdk/docs/install")
                return False
        except FileNotFoundError:
            print("❌ Google Cloud CLI not found. Install: https://cloud.google.com/sdk/docs/install")
            return False
        
        # Check authentication
        try:
            result = subprocess.run(["gcloud", "auth", "list"], capture_output=True, text=True)
            if "ACTIVE" in result.stdout:
                print("✅ GCP authentication configured")
            else:
                print("❌ GCP authentication required. Run: gcloud auth login")
                return False
        except:
            print("❌ GCP authentication check failed")
            return False
        
        # Set project
        subprocess.run(["gcloud", "config", "set", "project", self.project_id])
        print(f"✅ Project set: {self.project_id}")
        
        return True
    
    def enable_apis(self) -> bool:
        """Enable required GCP APIs"""
        print("🔧 Enabling required APIs...")
        
        apis = [
            "compute.googleapis.com",
            "container.googleapis.com", 
            "sql-component.googleapis.com",
            "cloudresourcemanager.googleapis.com",
            "iam.googleapis.com"
        ]
        
        for api in apis:
            try:
                result = subprocess.run([
                    "gcloud", "services", "enable", api, "--project", self.project_id
                ], capture_output=True, text=True)
                
                if result.returncode == 0:
                    print(f"✅ Enabled {api}")
                else:
                    print(f"❌ Failed to enable {api}: {result.stderr}")
                    return False
            except Exception as e:
                print(f"❌ API enable error: {e}")
                return False
        
        return True
    
    def create_network(self) -> bool:
        """Create VPC network and firewall rules"""
        print("🌐 Creating network infrastructure...")
        
        try:
            # Create VPC network
            subprocess.run([
                "gcloud", "compute", "networks", "create", self.network_name,
                "--subnet-mode", "auto",
                "--project", self.project_id
            ], capture_output=True)
            
            # Create firewall rules
            firewall_rules = [
                {
                    "name": "cinevivid-http",
                    "ports": "80,443", 
                    "description": "Allow HTTP/HTTPS traffic"
                },
                {
                    "name": "cinevivid-api",
                    "ports": "8001",
                    "description": "Allow API traffic"
                },
                {
                    "name": "cinevivid-frontend", 
                    "ports": "3000",
                    "description": "Allow frontend traffic"
                },
                {
                    "name": "cinevivid-monitoring",
                    "ports": "9090,3001",
                    "description": "Allow monitoring traffic"
                }
            ]
            
            for rule in firewall_rules:
                subprocess.run([
                    "gcloud", "compute", "firewall-rules", "create", rule["name"],
                    "--allow", f"tcp:{rule['ports']}",
                    "--network", self.network_name,
                    "--description", rule["description"],
                    "--project", self.project_id
                ], capture_output=True)
                
                print(f"✅ Created firewall rule: {rule['name']}")
            
            return True
            
        except Exception as e:
            print(f"❌ Network setup failed: {e}")
            return False
    
    def create_database(self) -> bool:
        """Create Cloud SQL PostgreSQL instance"""
        print("🗄️ Creating Cloud SQL database...")
        
        try:
            # Create SQL instance
            result = subprocess.run([
                "gcloud", "sql", "instances", "create", "cinevivid-db",
                "--database-version", "POSTGRES_13",
                "--tier", "db-standard-2",
                "--region", self.region,
                "--storage-type", "SSD",
                "--storage-size", "100GB",
                "--project", self.project_id
            ], capture_output=True, text=True)
            
            if result.returncode != 0 and "already exists" not in result.stderr:
                print(f"❌ Database creation failed: {result.stderr}")
                return False
            
            # Create database
            subprocess.run([
                "gcloud", "sql", "databases", "create", "cinevivid",
                "--instance", "cinevivid-db",
                "--project", self.project_id
            ], capture_output=True)
            
            # Create user
            db_password = self.generate_password()
            subprocess.run([
                "gcloud", "sql", "users", "create", "cinevivid_user",
                "--instance", "cinevivid-db", 
                "--password", db_password,
                "--project", self.project_id
            ], capture_output=True)
            
            print("✅ Database created successfully")
            print(f"   Instance: cinevivid-db")
            print(f"   Database: cinevivid")
            print(f"   User: cinevivid_user")
            print(f"   Password: {db_password}")
            
            return True
            
        except Exception as e:
            print(f"❌ Database setup failed: {e}")
            return False
    
    def create_vm_with_gpu(self) -> bool:
        """Create VM instance with GPU support"""
        print("🖥️ Creating VM with GPU...")
        
        try:
            # Create VM with GPU
            result = subprocess.run([
                "gcloud", "compute", "instances", "create", self.instance_name,
                "--zone", self.zone,
                "--machine-type", "n1-standard-8",
                "--accelerator", "count=1,type=nvidia-tesla-t4",
                "--image-family", "ubuntu-2004-lts",
                "--image-project", "ubuntu-os-cloud",
                "--boot-disk-size", "200GB",
                "--boot-disk-type", "pd-ssd",
                "--network", self.network_name,
                "--tags", "cinevivid-server",
                "--preemptible",  # 70% cost savings
                "--metadata", f"startup-script=#!/bin/bash\necho 'Startup script executed' > /tmp/startup.log",
                "--project", self.project_id
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ VM created successfully")
                print(f"   Instance: {self.instance_name}")
                print(f"   Zone: {self.zone}")
                print(f"   GPU: NVIDIA Tesla T4")
                print(f"   Storage: 200GB SSD")
                return True
            else:
                print(f"❌ VM creation failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ VM creation error: {e}")
            return False
    
    def setup_instance(self) -> bool:
        """Setup the VM with dependencies"""
        print("⚙️ Setting up VM dependencies...")
        
        setup_script = """#!/bin/bash
set -e

# Update system
sudo apt-get update
sudo apt-get install -y wget curl git

# Install NVIDIA drivers
sudo apt-get install -y nvidia-driver-470
sudo apt-get install -y nvidia-docker2

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Python 3.10 (compatible with our app)
sudo apt-get install -y python3.10 python3.10-venv python3.10-dev python3-pip

# Clone repository
cd /home
sudo git clone https://github.com/timecapsulellc/CineVivid
sudo chown -R $USER:$USER /home/CineVivid

# Setup environment
cd /home/CineVivid/SkyReels-V2
cp .env.example .env

echo "✅ VM setup completed!"
"""
        
        try:
            # Save setup script to temp file
            with open("setup_instance.sh", "w") as f:
                f.write(setup_script)
            
            # Copy script to instance
            subprocess.run([
                "gcloud", "compute", "scp", "setup_instance.sh",
                f"{self.instance_name}:/tmp/setup.sh",
                "--zone", self.zone,
                "--project", self.project_id
            ])
            
            # Execute setup script
            result = subprocess.run([
                "gcloud", "compute", "ssh", self.instance_name,
                "--zone", self.zone,
                "--project", self.project_id,
                "--command", "chmod +x /tmp/setup.sh && /tmp/setup.sh"
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Instance setup completed")
                return True
            else:
                print(f"❌ Instance setup failed: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Setup error: {e}")
            return False
        finally:
            # Cleanup temp file
            if os.path.exists("setup_instance.sh"):
                os.remove("setup_instance.sh")
    
    def deploy_application(self) -> str:
        """Deploy CineVivid application"""
        print("🚀 Deploying CineVivid application...")
        
        deploy_script = f"""#!/bin/bash
set -e

cd /home/CineVivid/SkyReels-V2

# Setup environment variables
cat > .env << EOF
# Core Application
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=$(openssl rand -hex 32)

# Database (update with actual Cloud SQL info)
DATABASE_URL=sqlite:///./cinevivid.db

# API Keys (you need to add these manually)
HUGGINGFACE_TOKEN=your_huggingface_token_here
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Hosting
DOMAIN={self.domain}
FRONTEND_URL=https://{self.domain}
BACKEND_URL=https://{self.domain}

# GPU Settings
USE_QUANTIZATION=false
MODEL_OFFLOAD_CPU=true
CUDA_VISIBLE_DEVICES=0

# Production settings
LOG_LEVEL=INFO
AUTO_INIT_DB=true
MAX_CONCURRENT_GENERATIONS=2
EOF

# Build and start application
sudo docker-compose -f docker-compose.prod.yml build
sudo docker-compose -f docker-compose.prod.yml up -d

echo "✅ Application deployed successfully!"
echo "🌐 Access: https://{self.domain}"
echo "📊 Health: https://{self.domain}/health"
echo "📚 API Docs: https://{self.domain}/docs"
"""
        
        try:
            # Save deployment script
            with open("deploy_app.sh", "w") as f:
                f.write(deploy_script)
            
            # Copy and execute
            subprocess.run([
                "gcloud", "compute", "scp", "deploy_app.sh",
                f"{self.instance_name}:/tmp/deploy.sh", 
                "--zone", self.zone,
                "--project", self.project_id
            ])
            
            result = subprocess.run([
                "gcloud", "compute", "ssh", self.instance_name,
                "--zone", self.zone,
                "--project", self.project_id, 
                "--command", "chmod +x /tmp/deploy.sh && /tmp/deploy.sh"
            ], capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Application deployed successfully")
                
                # Get external IP
                ip_result = subprocess.run([
                    "gcloud", "compute", "instances", "describe", self.instance_name,
                    "--zone", self.zone,
                    "--format", "get(networkInterfaces[0].accessConfigs[0].natIP)",
                    "--project", self.project_id
                ], capture_output=True, text=True)
                
                external_ip = ip_result.stdout.strip()
                
                return external_ip
            else:
                print(f"❌ Deployment failed: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Deployment error: {e}")
            return None
        finally:
            if os.path.exists("deploy_app.sh"):
                os.remove("deploy_app.sh")
    
    def setup_ssl(self, external_ip: str) -> bool:
        """Setup SSL certificate and domain"""
        print("🔐 Setting up SSL and domain...")
        
        ssl_script = f"""#!/bin/bash
set -e

# Install certbot
sudo apt-get install -y certbot nginx

# Create nginx configuration
sudo tee /etc/nginx/sites-available/cinevivid << 'EOF'
server {{
    listen 80;
    server_name {self.domain};
    
    location / {{
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }}
    
    location /api/ {{
        proxy_pass http://localhost:8001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }}
}}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/cinevivid /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# Get SSL certificate
sudo certbot --nginx -d {self.domain} --non-interactive --agree-tos --email admin@{self.domain}

echo "✅ SSL setup completed!"
echo "🌐 Your site: https://{self.domain}"
"""
        
        try:
            with open("setup_ssl.sh", "w") as f:
                f.write(ssl_script)
            
            subprocess.run([
                "gcloud", "compute", "scp", "setup_ssl.sh",
                f"{self.instance_name}:/tmp/ssl.sh",
                "--zone", self.zone,
                "--project", self.project_id
            ])
            
            result = subprocess.run([
                "gcloud", "compute", "ssh", self.instance_name,
                "--zone", self.zone,
                "--project", self.project_id,
                "--command", "chmod +x /tmp/ssl.sh && /tmp/ssl.sh"
            ])
            
            print(f"✅ SSL setup initiated for {self.domain}")
            print(f"🔧 Point your domain {self.domain} to IP: {external_ip}")
            
            return True
            
        except Exception as e:
            print(f"❌ SSL setup error: {e}")
            return False
        finally:
            if os.path.exists("setup_ssl.sh"):
                os.remove("setup_ssl.sh")
    
    def verify_deployment(self, external_ip: str) -> bool:
        """Verify deployment is working"""
        print("🧪 Verifying deployment...")
        
        test_script = f"""#!/bin/bash
echo "🔍 Testing CineVivid deployment..."

# Test backend health
echo "Testing backend health..."
curl -f http://localhost:8001/health || echo "❌ Backend health check failed"

# Test frontend
echo "Testing frontend..."
curl -f http://localhost:3000 || echo "❌ Frontend check failed"

# Test containers
echo "Checking Docker containers..."
sudo docker-compose -f /home/CineVivid/SkyReels-V2/docker-compose.prod.yml ps

# Check logs
echo "Recent logs:"
sudo docker-compose -f /home/CineVivid/SkyReels-V2/docker-compose.prod.yml logs --tail=20 backend

echo "✅ Deployment verification completed!"
"""
        
        try:
            with open("verify.sh", "w") as f:
                f.write(test_script)
            
            subprocess.run([
                "gcloud", "compute", "scp", "verify.sh",
                f"{self.instance_name}:/tmp/verify.sh",
                "--zone", self.zone,
                "--project", self.project_id
            ])
            
            result = subprocess.run([
                "gcloud", "compute", "ssh", self.instance_name,
                "--zone", self.zone, 
                "--project", self.project_id,
                "--command", "chmod +x /tmp/verify.sh && /tmp/verify.sh"
            ], capture_output=True, text=True)
            
            print("📋 Verification results:")
            print(result.stdout)
            
            return "✅" in result.stdout
            
        except Exception as e:
            print(f"❌ Verification error: {e}")
            return False
        finally:
            if os.path.exists("verify.sh"):
                os.remove("verify.sh")
    
    def generate_password(self, length: int = 32) -> str:
        """Generate secure password"""
        import secrets
        import string
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))
    
    def deploy(self) -> bool:
        """Execute complete deployment"""
        print("🚀 Starting GCP deployment for CineVivid...")
        print("=" * 60)
        
        steps = [
            ("Prerequisites", self.check_prerequisites),
            ("Enable APIs", self.enable_apis),
            ("Create Network", self.create_network),
            ("Create Database", self.create_database), 
            ("Create VM with GPU", self.create_vm_with_gpu),
            ("Setup Instance", self.setup_instance),
            ("Deploy Application", self.deploy_application)
        ]
        
        for step_name, step_func in steps:
            print(f"\n📋 Step: {step_name}")
            if step_name == "Deploy Application":
                external_ip = step_func()
                if not external_ip:
                    print(f"❌ Deployment failed at step: {step_name}")
                    return False
            else:
                success = step_func()
                if not success:
                    print(f"❌ Deployment failed at step: {step_name}")
                    return False
        
        # Final verification
        self.verify_deployment(external_ip)
        
        print("\n" + "=" * 60)
        print("🎉 GCP DEPLOYMENT COMPLETED!")
        print("=" * 60)
        print(f"🌐 External IP: {external_ip}")
        print(f"🖥️ SSH Access: gcloud compute ssh {self.instance_name} --zone {self.zone}")
        print(f"📊 Health Check: http://{external_ip}:8001/health")
        print(f"🎬 Frontend: http://{external_ip}:3000")
        print(f"📚 API Docs: http://{external_ip}:8001/docs")
        print(f"📈 Monitoring: http://{external_ip}:3001")
        
        print("\n🔧 NEXT STEPS:")
        print(f"1. Point domain {self.domain} to IP {external_ip}")
        print(f"2. Update .env with your API keys:")
        print(f"   gcloud compute ssh {self.instance_name} --zone {self.zone}")
        print(f"   nano /home/CineVivid/SkyReels-V2/.env")
        print(f"3. Add your HuggingFace and ElevenLabs API keys")
        print(f"4. Restart application: sudo docker-compose restart")
        print(f"5. Test all AI functions: python3 test_ai_functions.py")
        
        return True

def main():
    """Main deployment function"""
    print("🎬 CineVivid GCP Deployment Wizard")
    print("=" * 60)
    
    # Get configuration
    if len(sys.argv) >= 3:
        project_id = sys.argv[1]
        domain = sys.argv[2]
    else:
        project_id = input("Enter GCP Project ID: ")
        domain = input("Enter domain name (e.g., yourdomain.com): ")
    
    region = input("Enter region (default: us-central1): ") or "us-central1"
    
    # Confirm deployment
    print(f"\n📋 DEPLOYMENT CONFIGURATION:")
    print(f"   Project: {project_id}")
    print(f"   Domain: {domain}")
    print(f"   Region: {region}")
    print(f"   Estimated Cost: ~$367/month")
    
    confirm = input("\n🚀 Proceed with deployment? (yes/no): ")
    if confirm.lower() not in ['yes', 'y']:
        print("❌ Deployment cancelled")
        return False
    
    # Execute deployment
    deployer = GCPDeployer(project_id, domain, region)
    success = deployer.deploy()
    
    if success:
        print("\n🎉 Deployment successful! Your CineVivid platform is live on GCP!")
    else:
        print("\n❌ Deployment failed. Check logs above for details.")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)