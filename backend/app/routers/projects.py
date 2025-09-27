from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.core.factory import get_github_service, get_database_service
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter()


@router.get("/projects")
async def get_projects() -> List[Dict[str, Any]]:
    """Get all projects from GitHub API with caching"""
    try:
        github_svc = get_github_service()
        projects = await github_svc.get_processed_projects()
        logger.info(f"Successfully retrieved {len(projects)} projects")
        return projects
    except Exception as e:
        logger.error(f"Failed to get projects: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch projects: {str(e)}"
        )


@router.get("/projects/{project_name}")
async def get_project_details(project_name: str) -> Dict[str, Any]:
    """Get detailed information about a specific project"""
    try:
        github_svc = get_github_service()
        project = await github_svc.get_repo_details(project_name)
        if not project:
            raise HTTPException(
                status_code=404,
                detail=f"Project '{project_name}' not found"
            )

        logger.info(f"Successfully retrieved details for project: {project_name}")
        return project
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get project details for {project_name}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch project details: {str(e)}"
        )


@router.get("/test-db")
async def test_database():
    """Test database operations"""
    try:
        db_svc = get_database_service()

        # Test creating a skill if none exist
        existing_skills = db_svc.get_skills()

        if not existing_skills:
            # Create a test skill
            skill_data = {
                "name": "Python",
                "category": "Backend",
                "proficiency": 9,
                "years_experience": 3,
                "description": "Advanced Python development including FastAPI, Django, and data analysis",
                "is_featured": True
            }

            created_skill = db_svc.create_skill(skill_data)
            if created_skill:
                logger.info(f"Created test skill: {created_skill['name']}")
                return {
                    "message": "Database test successful!",
                    "created_skill": created_skill
                }
            else:
                raise HTTPException(status_code=500, detail="Failed to create test skill")
        else:
            logger.info(f"Found {len(existing_skills)} existing skills")
            return {
                "message": "Database connected!",
                "existing_skills_count": len(existing_skills),
                "skills": [{"name": skill["name"], "category": skill["category"]} for skill in existing_skills]
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database test failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database test failed: {str(e)}"
        )
