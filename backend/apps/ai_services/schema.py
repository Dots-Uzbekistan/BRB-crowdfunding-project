from typing import List

from pydantic import BaseModel, Field


class TagGenerationOutput(BaseModel):
    tags: List[str] = Field(..., title="Tags generated for the input text")


class CategoryRecommendationOutput(BaseModel):
    category: str = Field(..., title="Recommended category for the campaign")
    not_enough_info: bool = Field(False, title="Indicates if there is not enough information to generate a category")



class CollaborationRecommendationOutput(BaseModel):
    verdict: str = Field(..., title="Collaboration verdict (yes or no)")
    matching_percentage: int = Field(..., title="Matching percentage")
    reason: str = Field(..., title="Short reason for the verdict")


class ModerationOutput(BaseModel):
    action: str = Field(...,
                        title="Moderation action (requires_admin_review, does_not_require_admin_review, block_changes)")
    reason: str = Field(..., title="Short reason for the decision")
