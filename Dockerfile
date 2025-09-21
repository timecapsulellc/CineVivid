FROM nvidia/cuda:12.1.0-cudnn8-devel-ubuntu22.04

# Set the working directory
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y python3.10 python3-pip ffmpeg git

# Set Python 3.10 as default
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1

# Copy the requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Set the entrypoint
CMD ["python3", "generate_video_df.py", "--help"]