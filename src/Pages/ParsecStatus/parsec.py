import os
import time
import json
import base64
import datetime
import requests
import psutil
import subprocess
import logging
import sys
from pathlib import Path

# Configuration
GITHUB_REPO = "SheruShafiq/sauceBackend"
STATUS_FILE = "parsec_status.json"
LOG_FILE = "parsec_log.json"
GITHUB_TOKEN = ''

# Optional: Path to Parsec executable (adjust if needed)
PARSEC_PATH = r"C:\Program Files\Parsec\parsecd.exe"
if os.name != 'nt':
    PARSEC_PATH = "parsec"

# Setup logging
def setup_logging():
    """Setup comprehensive logging to both file and console"""
    log_dir = Path(__file__).parent / "logs"
    log_dir.mkdir(exist_ok=True)
    
    log_file = log_dir / f"parsec_monitor_{datetime.datetime.now().strftime('%Y%m%d')}.log"
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Setup file handler
    file_handler = logging.FileHandler(log_file)
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    
    # Setup console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    
    # Setup logger
    logger = logging.getLogger('parsec_monitor')
    logger.setLevel(logging.DEBUG)
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Initialize logger
logger = setup_logging()

# Helper: Fetch file content and SHA from GitHub with retry logic
def github_get_file(repo, path, max_retries=3):
    """Fetch file from GitHub with retry logic for robustness"""
    url = f"https://api.github.com/repos/{repo}/contents/{path}"
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    
    for attempt in range(max_retries):
        try:
            logger.debug(f"Fetching {path} from GitHub (attempt {attempt + 1}/{max_retries})")
            resp = requests.get(url, headers=headers, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                content_str = base64.b64decode(data["content"]).decode('utf-8')
                sha = data["sha"]
                logger.debug(f"Successfully fetched {path}, SHA: {sha[:8]}...")
                return content_str, sha
            elif resp.status_code == 404:
                logger.warning(f"File {path} not found on GitHub")
                return None, None
            else:
                logger.error(f"GitHub GET {path} failed: {resp.status_code} - {resp.text}")
                if attempt == max_retries - 1:
                    raise Exception(f"GitHub GET {path} failed: {resp.status_code} - {resp.text}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error fetching {path}: {e}")
            if attempt == max_retries - 1:
                raise
        
        if attempt < max_retries - 1:
            time.sleep(2 ** attempt)  # Exponential backoff
    
    raise Exception(f"Failed to fetch {path} after {max_retries} attempts")

# Helper: Update file on GitHub with SHA conflict resolution
def github_update_file(repo, path, new_content_str, message, expected_sha, max_retries=3):
    """Update file on GitHub with automatic SHA conflict resolution"""
    url = f"https://api.github.com/repos/{repo}/contents/{path}"
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    
    for attempt in range(max_retries):
        try:
            # If we don't have a SHA or it's the first attempt, get the latest
            if not expected_sha or attempt > 0:
                logger.debug(f"Fetching latest SHA for {path} before update (attempt {attempt + 1})")
                try:
                    _, latest_sha = github_get_file(repo, path)
                    expected_sha = latest_sha
                    logger.debug(f"Using latest SHA: {expected_sha[:8]}...")
                except Exception as e:
                    logger.error(f"Failed to get latest SHA: {e}")
                    if attempt == max_retries - 1:
                        raise
                    continue
            
            # Prepare payload
            new_content_b64 = base64.b64encode(new_content_str.encode('utf-8')).decode('utf-8')
            payload = {
                "message": message,
                "content": new_content_b64,
                "sha": expected_sha
            }
            
            logger.debug(f"Updating {path} with SHA {expected_sha[:8]}... (attempt {attempt + 1}/{max_retries})")
            resp = requests.put(url, headers=headers, json=payload, timeout=10)
            
            if resp.status_code in (200, 201):
                new_sha = resp.json()["content"]["sha"]
                logger.info(f"Successfully updated {path}: {message}")
                logger.debug(f"New SHA: {new_sha[:8]}...")
                return new_sha
            elif resp.status_code == 409:
                logger.warning(f"SHA conflict updating {path} (attempt {attempt + 1}): {resp.json().get('message', 'Unknown error')}")
                expected_sha = None  # Force refetch on next attempt
                if attempt < max_retries - 1:
                    time.sleep(1)  # Brief pause before retry
                    continue
            else:
                logger.error(f"GitHub update {path} failed: {resp.status_code} - {resp.text}")
                if attempt == max_retries - 1:
                    raise Exception(f"GitHub update {path} failed: {resp.status_code} - {resp.text}")
        
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error updating {path}: {e}")
            if attempt == max_retries - 1:
                raise
        
        if attempt < max_retries - 1:
            time.sleep(2 ** attempt)  # Exponential backoff
    
    raise Exception(f"Failed to update {path} after {max_retries} attempts")

# Helper: Check if Parsec is running
def is_parsec_running():
    """Check if Parsec is running with detailed logging"""
    parsec_processes = []
    try:
        for proc in psutil.process_iter(['name', 'pid']):
            name = proc.info['name']
            if name and name.lower().startswith("parsec"):
                parsec_processes.append(f"{name} (PID: {proc.info['pid']})")
        
        if parsec_processes:
            logger.debug(f"Found Parsec processes: {', '.join(parsec_processes)}")
            return True
        else:
            logger.debug("No Parsec processes found")
            return False
    except Exception as e:
        logger.error(f"Error checking Parsec processes: {e}")
        return False

# Helper: Start Parsec process
def start_parsec():
    """Start Parsec with detailed logging"""
    try:
        logger.info(f"Starting Parsec from: {PARSEC_PATH}")
        if os.name == 'nt':
            subprocess.Popen([PARSEC_PATH], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        else:
            subprocess.Popen([PARSEC_PATH], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        logger.debug("Parsec process started successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to start Parsec: {e}")
        return False

# Helper: Kill Parsec process(es)
def kill_parsec():
    """Kill Parsec processes with detailed logging"""
    killed_processes = []
    failed_processes = []
    
    try:
        for proc in psutil.process_iter(['name', 'pid']):
            try:
                if proc.info['name'] and proc.info['name'].lower().startswith("parsec"):
                    proc_name = f"{proc.info['name']} (PID: {proc.info['pid']})"
                    proc.kill()
                    killed_processes.append(proc_name)
                    logger.debug(f"Killed process: {proc_name}")
            except psutil.NoSuchProcess:
                continue
            except psutil.AccessDenied as e:
                failed_processes.append(f"{proc.info['name']} (PID: {proc.info['pid']}): Access denied")
                logger.warning(f"Access denied killing {proc.info['name']} (PID: {proc.info['pid']})")
            except Exception as e:
                failed_processes.append(f"{proc.info['name']} (PID: {proc.info['pid']}): {e}")
                logger.error(f"Error killing {proc.info['name']} (PID: {proc.info['pid']}): {e}")
        
        if killed_processes:
            logger.info(f"Killed Parsec processes: {', '.join(killed_processes)}")
        
        if failed_processes:
            logger.warning(f"Failed to kill some processes: {', '.join(failed_processes)}")
            return False
        
        return True
    except Exception as e:
        logger.error(f"Error during Parsec kill operation: {e}")
        return False

# Main loop for monitoring and controlling Parsec
def monitor_loop(poll_interval=15):
    """Main monitoring loop with comprehensive logging"""
    logger.info("=== Starting Parsec Monitor ===")
    logger.info(f"Poll interval: {poll_interval} seconds")
    logger.info(f"GitHub repo: {GITHUB_REPO}")
    logger.info(f"Parsec path: {PARSEC_PATH}")
    
    last_status = None
    consecutive_errors = 0
    max_consecutive_errors = 5
    
    while True:
        try:
            logger.debug("--- Starting monitor cycle ---")
            
            # 1. Fetch current status from GitHub
            logger.debug("Fetching status from GitHub...")
            status_content, status_sha = github_get_file(GITHUB_REPO, STATUS_FILE)
            
            if not status_content:
                logger.error("Status file not found on GitHub")
                time.sleep(poll_interval)
                continue
            
            status = json.loads(status_content)
            desired = status.get("statusShouldBe", 0)
            current = status.get("statusCurrently", 0)
            
            logger.debug(f"Status from GitHub - Desired: {desired}, Current: {current}, SHA: {status_sha[:8]}...")
            
            # 2. Determine actual Parsec state
            actually_running = is_parsec_running()
            actually_running_int = 1 if actually_running else 0
            
            logger.info(f"Status check - Desired: {desired}, Recorded: {current}, Actual: {actually_running_int}")
            
            now_ts = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            
            # Prepare update variables
            update_needed = False
            reason = ""
            error_msg = ""
            
            # 3. Sync recorded state with actual state
            if actually_running_int != current:
                logger.warning(f"State mismatch detected! Recorded: {current}, Actual: {actually_running_int}")
                update_needed = True
                status["statusCurrently"] = actually_running_int
                if actually_running:
                    reason = "Parsec started outside tool"
                else:
                    reason = "Parsec stopped outside tool"
            
            # 4. Enforce desired state
            if desired == 1 and not actually_running:
                logger.info("Parsec should be running but isn't - attempting to start...")
                
                retries = 0
                delay = 5
                started = False
                
                while retries < 3:
                    if start_parsec():
                        time.sleep(3)  # Wait for Parsec to initialize
                        if is_parsec_running():
                            started = True
                            logger.info("Parsec started successfully")
                            break
                        else:
                            logger.warning("Parsec process started but not detected as running")
                    
                    retries += 1
                    if retries < 3:
                        logger.warning(f"Start attempt {retries} failed, retrying in {delay} seconds...")
                        time.sleep(delay)
                        delay *= 2
                
                if started:
                    status["statusCurrently"] = 1
                    reason = "Started Parsec successfully"
                    error_msg = ""
                else:
                    status["statusCurrently"] = 0
                    reason = "Failed to start Parsec"
                    error_msg = "Unable to start Parsec after multiple attempts"
                    logger.error("Failed to start Parsec after all retry attempts")
                
                update_needed = True
            
            elif desired == 0 and actually_running:
                logger.info("Parsec should be stopped but is running - attempting to kill...")
                
                killed = kill_parsec()
                time.sleep(2)  # Wait for processes to die
                
                if killed and not is_parsec_running():
                    status["statusCurrently"] = 0
                    reason = "Stopped Parsec successfully"
                    error_msg = ""
                    logger.info("Parsec stopped successfully")
                else:
                    status["statusCurrently"] = 1 if is_parsec_running() else 0
                    reason = "Failed to stop Parsec"
                    error_msg = "Parsec process could not be terminated"
                    logger.error("Failed to stop Parsec completely")
                
                update_needed = True
            
            # 5. Update GitHub if needed
            if update_needed:
                logger.info(f"Updating GitHub status: {reason}")
                status["lastUpdated"] = now_ts
                status["failureReason"] = error_msg if error_msg else None
                
                # Remove None values to keep JSON clean
                status = {k: v for k, v in status.items() if v is not None}
                
                try:
                    new_sha = github_update_file(
                        GITHUB_REPO, 
                        STATUS_FILE, 
                        json.dumps(status, indent=2), 
                        f"Parsec {reason} @ {now_ts}", 
                        status_sha
                    )
                    logger.info("GitHub status updated successfully")
                    consecutive_errors = 0  # Reset error counter on success
                except Exception as e:
                    logger.error(f"Failed to update GitHub status: {e}")
                    consecutive_errors += 1
            else:
                logger.debug("No updates needed")
                consecutive_errors = 0  # Reset error counter if no action needed
            
            last_status = desired
            
        except Exception as e:
            consecutive_errors += 1
            logger.error(f"Monitor loop error ({consecutive_errors}/{max_consecutive_errors}): {e}")
            
            if consecutive_errors >= max_consecutive_errors:
                logger.critical(f"Too many consecutive errors ({consecutive_errors}). Exiting.")
                break
        
        logger.debug(f"Sleeping for {poll_interval} seconds...")
        time.sleep(poll_interval)

# Start monitoring loop
if __name__ == "__main__":
    try:
        monitor_loop(poll_interval=30)  # Check every 30 seconds
    except KeyboardInterrupt:
        logger.info("Monitor stopped by user")
    except Exception as e:
        logger.critical(f"Monitor crashed: {e}")
    finally:
        logger.info("=== Parsec Monitor Ended ===")
