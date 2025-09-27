import httpx
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.logging import get_logger
from app.services.redis_service import redis_service

logger = get_logger(__name__)


class GitHubService:
    def __init__(self):
        self.username = settings.github_username
        self.token = settings.github_token
        self.base_url = "https://api.github.com"

        # Your project configuration
        self.my_projects = [
            "Brick-Breaker",
            "KNN-Classifier-Server",
            "Producer-Consumer",
            "space-ease"
        ]

        self.contributed_projects = [
            {
                "title": "Yeet Chat Application",
                "description": "Real-time chat application with modern UI",
                "github": "https://github.com/aliktepl/yeet-chat-application",
                "demo": "",
                "language": "JavaScript",
                "stars": 0,
                "forks": 0,
                "contribution": True
            }
        ]

    def _get_headers(self) -> Dict[str, str]:
        """Get headers for GitHub API requests"""
        headers = {"Accept": "application/vnd.github.v3+json"}
        if self.token:
            headers["Authorization"] = f"token {self.token}"
        return headers

    async def fetch_user_repos(self) -> Optional[List[Dict[str, Any]]]:
        """Fetch user repositories from GitHub API"""
        cache_key = f"github_repos_{self.username}"

        # Check cache first
        cached_data = redis_service.get_cache(cache_key)
        if cached_data:
            logger.info("📦 Returning cached GitHub repositories")
            return cached_data

        try:
            url = f"{self.base_url}/users/{self.username}/repos"
            headers = self._get_headers()

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                repos = response.json()

                # Cache for 1 hour
                redis_service.set_cache(cache_key, repos, 3600)
                logger.info(f"💾 Cached {len(repos)} repositories")

                return repos

        except httpx.HTTPStatusError as e:
            logger.error(f"GitHub API HTTP error: {e.response.status_code} - {e.response.text}")
            return None
        except Exception as e:
            logger.error(f"Failed to fetch GitHub repositories: {e}")
            return None

    async def get_processed_projects(self) -> List[Dict[str, Any]]:
        """Get processed projects (filtered and formatted)"""
        cache_key = f"processed_projects_{self.username}"

        # Check cache first
        cached_projects = redis_service.get_cache(cache_key)
        if cached_projects:
            logger.info("📦 Returning cached processed projects")
            return cached_projects

        # Fetch from GitHub
        repos = await self.fetch_user_repos()
        if not repos:
            logger.warning("No repositories fetched, returning contributed projects only")
            return self.contributed_projects

        # Filter and format my projects
        projects = []
        for repo in repos:
            if repo["name"] in self.my_projects:
                project = {
                    "title": repo["name"],
                    "description": repo["description"] or "No description available",
                    "tech": repo.get("topics", []),
                    "github": repo["html_url"],
                    "demo": repo.get("homepage", ""),
                    "language": repo.get("language", ""),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "contribution": False,
                    "created_at": repo.get("created_at"),
                    "updated_at": repo.get("updated_at")
                }
                projects.append(project)

        # Add contributed projects
        projects.extend(self.contributed_projects)

        # Cache processed projects for 30 minutes
        redis_service.set_cache(cache_key, projects, 1800)
        logger.info(f"💾 Cached {len(projects)} processed projects")

        return projects

    async def get_repo_details(self, repo_name: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific repository"""
        try:
            url = f"{self.base_url}/repos/{self.username}/{repo_name}"
            headers = self._get_headers()

            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                return response.json()

        except Exception as e:
            logger.error(f"Failed to fetch repository details for {repo_name}: {e}")
            return None


# Global GitHub service instance
github_service = GitHubService()
