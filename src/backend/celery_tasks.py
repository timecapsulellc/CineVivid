from celery import Celery
import os

# Set up Celery
celery_app = Celery('cinevivid_tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

# Import data storage
from .db import videos_db

@celery_app.task(bind=True)
def generate_video_task(self, task_id: str):
    """Celery task for video generation"""
    try:
        # Find the video request
        video_data = None
        for v in videos_db:
            if v.get('task_id') == task_id:
                video_data = v
                break

        if not video_data:
            return {'status': 'failed', 'error': 'Task not found'}

        # Update status to processing
        video_data['status'] = 'processing'
        video_data['progress'] = 10

        # Get generator
        generator = get_video_generator()

        # Calculate num_frames from duration (assume 24 fps)
        duration = video_data.get('duration', 5)
        num_frames = duration * 24

        # Generate video
        output_path = generator.generate_video(
            prompt=video_data['prompt'],
            num_frames=num_frames,
            fps=24
        )

        # Update status
        video_data['status'] = 'completed'
        video_data['progress'] = 100
        video_data['result'] = f'/videos/{os.path.basename(output_path)}'

        return {'status': 'completed', 'result': video_data['result']}

    except Exception as e:
        # Update status on failure
        for v in videos_db:
            if v.get('task_id') == task_id:
                v['status'] = 'failed'
                v['error'] = str(e)
                break
        raise self.retry(countdown=60, exc=e)